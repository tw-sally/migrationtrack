import { Database, LayoutDashboard, ListTodo, Calendar, Settings, User, Users } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const baseAdminItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Migration List", url: "/migrations", icon: Database },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Task Templates", url: "/templates", icon: Settings },
];

const accountItem = { title: "帳號管理", url: "/accounts", icon: Users };

const dbaItems = [
  { title: "My Tasks", url: "/my-tasks", icon: ListTodo },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { roles, displayName } = useAuth();

  const isAdmin = roles.includes("admin");
  const adminItems = isAdmin ? [...baseAdminItems, accountItem] : baseAdminItems;

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-sidebar-primary" />
            <div>
              <h2 className="text-sm font-bold text-sidebar-foreground">DB Migration</h2>
              <p className="text-xs text-sidebar-foreground/60">Management Platform</p>
            </div>
          </div>
        )}
        {collapsed && <Database className="h-6 w-6 text-sidebar-primary mx-auto" />}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end={item.url === "/"} activeClassName="bg-sidebar-accent text-sidebar-accent-foreground">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>DBA</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dbaItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} activeClassName="bg-sidebar-accent text-sidebar-accent-foreground">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2 text-sidebar-foreground/70">
            <User className="h-4 w-4" />
            <span className="text-xs">{displayName || "User"}</span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
