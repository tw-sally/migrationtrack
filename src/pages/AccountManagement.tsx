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
import { Plus, Users, Shield, UserIcon, CheckCircle, Ban, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ManagedUser {
  id: string;
  email: string;
  display_name: string;
  roles: string[];
  banned: boolean;
  created_at: string;
}

const ROLE_LABELS: Record<string, { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "outline" }> = {
  admin: { label: "管理員", icon: <Shield className="h-3 w-3" />, variant: "default" },
  dba: { label: "DBA", icon: <UserIcon className="h-3 w-3" />, variant: "secondary" },
  user: { label: "一般用戶", icon: <UserIcon className="h-3 w-3" />, variant: "outline" },
};

async function callManageUsers(action: string, params: Record<string, unknown> = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await supabase.functions.invoke("manage-users", {
    body: { action, ...params },
    headers: { Authorization: `Bearer ${session?.access_token}` },
  });
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

export default function AccountManagement() {
  const { roles } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newRole, setNewRole] = useState("user");

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

  const handleCreate = async () => {
    if (!newEmail || !newPassword) return;
    setCreating(true);
    try {
      await callManageUsers("create", {
        email: newEmail,
        password: newPassword,
        display_name: newDisplayName || newEmail,
        role: newRole,
      });
      toast.success("帳號建立成功");
      setDialogOpen(false);
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
                  <TableHead>角色</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead>建立時間</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const primaryRole = u.roles[0] || "user";
                  const roleInfo = ROLE_LABELS[primaryRole] || ROLE_LABELS.user;
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.display_name}</TableCell>
                      <TableCell>{u.email}</TableCell>
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
                        {!u.roles.includes("admin") && (
                          <Button
                            variant={u.banned ? "outline" : "destructive"}
                            size="sm"
                            onClick={() => handleToggleBan(u.id, u.banned)}
                          >
                            {u.banned ? "啟用" : "停用"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
