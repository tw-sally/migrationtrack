import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Users, Shield, UserIcon, CheckCircle, Ban, Loader2, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ManagedUser {
  id: string;
  email: string;
  display_name: string;
  windows_account: string;
  roles: string[];
  banned: boolean;
  created_at: string;
}

const DBA_LIST = ["STRUANB", "WYCHIANG", "YHLUZS", "JRLULAI", "RXYEA", "CHWUAZZI", "HEHUANGB", "HMHSIEHC"];

const MANAGE_USERS_FUNCTION = "manage-users-v2";

async function callManageUsers(action: string, params: Record<string, unknown> = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await supabase.functions.invoke(MANAGE_USERS_FUNCTION, {
    body: { action, ...params },
    headers: { Authorization: `Bearer ${session?.access_token}` },
  });
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

export default function AccountManagement() {
  const { roles, user } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newWindowsAccount, setNewWindowsAccount] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newRole, setNewRole] = useState("user");
  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);
  const [editTarget, setEditTarget] = useState<ManagedUser | null>(null);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editWindowsAccount, setEditWindowsAccount] = useState("");
  const [saving, setSaving] = useState(false);

  const isAdmin = roles.includes("admin");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await callManageUsers("list");
      setUsers(data);
    } catch (err: any) {
      toast.error("載入使用者失敗: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  // When windows account changes, auto-fill defaults
  const handleWindowsAccountChange = (val: string) => {
    setNewWindowsAccount(val);
    setNewDisplayName(val);
    setNewEmail(val ? `${val.toLowerCase()}@test.com` : "");
  };

  const handleCreate = async () => {
    if (!newEmail || !newPassword) return;
    setCreating(true);
    try {
      await callManageUsers("create", {
        email: newEmail,
        password: newPassword,
        display_name: newDisplayName || newEmail,
        role: newRole,
        windows_account: newWindowsAccount,
      });
      toast.success("帳號建立成功");
      setDialogOpen(false);
      setNewWindowsAccount("");
      setNewEmail("");
      setNewPassword("");
      setNewDisplayName("");
      setNewRole("user");
      fetchUsers();
    } catch (err: any) {
      toast.error("建立失敗: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await callManageUsers("update_role", { user_id: userId, role });
      toast.success("角色已更新");
      fetchUsers();
    } catch (err: any) {
      toast.error("更新失敗: " + err.message);
    }
  };

  const handleToggleBan = async (userId: string, currentlyBanned: boolean) => {
    try {
      await callManageUsers("toggle_ban", { user_id: userId, ban: !currentlyBanned });
      toast.success(currentlyBanned ? "已啟用帳號" : "已停用帳號");
      fetchUsers();
    } catch (err: any) {
      toast.error("操作失敗: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await callManageUsers("delete", { user_id: deleteTarget.id });
      toast.success("帳號已刪除");
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: any) {
      toast.error("刪除失敗: " + err.message);
    }
  };

  const openEdit = (u: ManagedUser) => {
    setEditTarget(u);
    setEditDisplayName(u.display_name);
    setEditWindowsAccount(u.windows_account || "");
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      await callManageUsers("update", {
        user_id: editTarget.id,
        display_name: editDisplayName,
        windows_account: editWindowsAccount,
      });
      toast.success("帳號已更新");
      setEditTarget(null);
      fetchUsers();
    } catch (err: any) {
      toast.error("更新失敗: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleBatchCreateDBAs = async () => {
    const existingKeys = users.map(u => (u.windows_account || u.display_name || "").toUpperCase());
    const toCreate = DBA_LIST.filter(d => !existingKeys.includes(d.toUpperCase()));
    if (toCreate.length === 0) {
      toast.info("所有 DBA 帳號已存在");
      return;
    }
    let created = 0;
    for (const wa of toCreate) {
      try {
        await callManageUsers("create", {
          email: `${wa.toLowerCase()}@test.com`,
          password: "changeme123",
          display_name: wa,
          role: "dba",
          windows_account: wa,
        });
        created++;
      } catch (err: any) {
        console.error(`Failed to create ${wa}:`, err.message);
      }
    }
    toast.success(`已建立 ${created} 個 DBA 帳號`);
    fetchUsers();
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">您沒有權限存取此頁面</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">帳號管理</h1>
          <p className="text-muted-foreground">管理系統使用者帳號</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={async () => {
            try {
              const res = await callManageUsers("batch_set_windows_account");
              toast.success(res.message);
              fetchUsers();
            } catch (err: any) { toast.error(err.message); }
          }}>
            同步 Windows Account
          </Button>
          <Button variant="outline" onClick={handleBatchCreateDBAs}>
            批量建立 DBA 帳號
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新增帳號
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增使用者帳號</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Windows Account</Label>
                  <Input
                    value={newWindowsAccount}
                    onChange={(e) => handleWindowsAccountChange(e.target.value)}
                    placeholder="例: STRUANB"
                  />
                </div>
                <div className="space-y-2">
                  <Label>顯示名稱</Label>
                  <Input value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} placeholder="例: Sally" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="user@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label>密碼</Label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••" required />
                </div>
                <div className="space-y-2">
                  <Label>角色</Label>
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">管理員</SelectItem>
                      <SelectItem value="dba">DBA</SelectItem>
                      <SelectItem value="user">一般用戶</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreate} disabled={creating} className="w-full">
                  {creating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  建立帳號
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            使用者列表
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>顯示名稱</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Windows Account</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead>建立時間</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const primaryRole = u.roles[0] || "user";
                  const isSelf = u.id === user?.id;
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.display_name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.windows_account || "-"}</TableCell>
                      <TableCell>
                        {u.roles.includes("admin") ? (
                          <Badge variant="default" className="gap-1">
                            <Shield className="h-3 w-3" />
                            管理員
                          </Badge>
                        ) : (
                          <Select
                            value={primaryRole}
                            onValueChange={(val) => handleRoleChange(u.id, val)}
                          >
                            <SelectTrigger className="w-[130px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dba">DBA</SelectItem>
                              <SelectItem value="user">一般用戶</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.banned ? "destructive" : "outline"} className="gap-1">
                          {u.banned ? <Ban className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                          {u.banned ? "已停用" : "啟用中"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(u.created_at), "yyyy/M/d")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(u)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {!u.roles.includes("admin") && (
                            <Button
                              variant={u.banned ? "outline" : "destructive"}
                              size="sm"
                              onClick={() => handleToggleBan(u.id, u.banned)}
                            >
                              {u.banned ? "啟用" : "停用"}
                            </Button>
                          )}
                          {!isSelf && !u.roles.includes("admin") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTarget(u)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確認刪除帳號</AlertDialogTitle>
            <AlertDialogDescription>
              確定要刪除 <strong>{deleteTarget?.display_name}</strong> ({deleteTarget?.email}) 嗎？此操作無法復原。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯帳號</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Windows Account</Label>
              <Input value={editWindowsAccount} onChange={(e) => setEditWindowsAccount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>顯示名稱</Label>
              <Input value={editDisplayName} onChange={(e) => setEditDisplayName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={editTarget?.email || ""} disabled className="opacity-60" />
            </div>
            <Button onClick={handleUpdate} disabled={saving} className="w-full">
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              儲存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
