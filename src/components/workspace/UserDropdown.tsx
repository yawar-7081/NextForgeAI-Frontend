import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserInfo } from "@/lib/api";
import {
  ChevronDown,
  CreditCard,
  LogOut,
  Palette,
  Settings,
  User,
} from "lucide-react";

interface UserDropdownProps {
  onLogout: () => void;
}

export default function UserDropdown({ onLogout }: UserDropdownProps) {
  const user = getUserInfo();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/10">
          <Avatar className="h-9 w-9 rounded-xl border border-white/10 shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-violet-500 text-sm font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold text-white">
              {user?.name ?? "User"}
            </p>

            <p className="text-xs text-white/50">Developer</p>
          </div>
          <ChevronDown className="h-4 w-4 text-white/40 transition-transform duration-300 group-hover:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-2xl border border-white/10 bg-[#08101f]/95 p-2 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,.45)]"
      >
        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-sm font-semibold text-white">{user?.name}</p>

          <p className="mt-1 text-xs text-white/50">{user?.username}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 hover:bg-white/5">
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 hover:bg-white/5">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 hover:bg-white/5">
          <CreditCard className="mr-2 h-4 w-4" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 hover:bg-white/5">
          <Palette className="mr-2 h-4 w-4" />
          Theme
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer rounded-xl py-2.5 text-red-400 hover:bg-red-500/10 focus:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
