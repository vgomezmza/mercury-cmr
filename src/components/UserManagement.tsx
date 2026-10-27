"use client";

import React, { useState, useMemo } from "react";
import type { User, UserRole, Lead } from "../types/crm";
import {
  Users,
  UserPlus,
  Shield,
  Key,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Lock,
  ArrowRight,
  ArrowLeftRight,
  Check,
  X,
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Building2,
  Briefcase,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react";

interface UserManagementProps {
  users: User[];
  onAddUser: (newUser: User) => void;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: string) => void;
  currentUser: User;
  leads?: Lead[];
  onAssignLead?: (leadId: string, assignedUserId: string, assignedUserName: string) => void;
}

type ManagementSection =
  | "directory"
  | "create"
  | "roles"
  | "security"
  | "transfer"
  | "audit";

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  currentUser,
  leads = [],
  onAssignLead,
}) => {
  const [activeSection, setActiveSection] = useState<ManagementSection>("directory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Create form state
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("mercury2026");
  const [rol, setRol] = useState<UserRole>("COMERCIAL");
  const [cargo, setCargo] = useState("");

  // Password reset modal / form state
  const [passwordModalUser, setPasswordModalUser] = useState<User | null>(null);
  const [changePasswordValue, setChangePasswordValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Portfolio transfer state
  const [transferSourceUserId, setTransferSourceUserId] = useState<string>("");
  const [transferTargetUserId, setTransferTargetUserId] = useState<string>("");

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const activeCount = users.filter((u) => u.activo).length;
  const adminCount = users.filter((u) => u.rol === "ADMIN").length;
  const comercialCount = users.filter((u) => u.rol === "COMERCIAL").length;
  const pmCount = users.filter((u) => u.rol === "PROJECT_MANAGER").length;

  // Filtered users for directory
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.cargo && u.cargo.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchRole =
        selectedRoleFilter === "ALL" || u.rol === selectedRoleFilter;

      return matchSearch && matchRole;
    });
  }, [users, searchTerm, selectedRoleFilter]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) return;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      password: password || "mercury2026",
      rol,
      cargo:
        cargo.trim() ||
        (rol === "ADMIN"
          ? "Director General"
          : rol === "COMERCIAL"
          ? "Ejecutivo Comercial"
          : "Project Manager"),
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 50000)}?w=100&h=100&fit=crop`,
      activo: true,
      ultimoAcceso: "Registrado recientemente",
    };

    onAddUser(newUser);
    setNombre("");
    setEmail("");
    setCargo("");
    setPassword("mercury2026");
    setActiveSection("directory");
    showFeedback(`Usuario ${newUser.nombre} registrado con éxito en el sistema.`);
  };

  const handleToggleActive = (user: User) => {
    if (user.id === currentUser.id) {
      alert("No puedes suspender tu propia cuenta de Administrador.");
      return;
    }
    const updated = { ...user, activo: !user.activo };
    onUpdateUser(updated);
    showFeedback(
      `Usuario ${user.nombre} ${updated.activo ? "activado" : "suspendido"}.`
    );
  };

  const handleChangeRole = (user: User, newRole: UserRole) => {
    if (user.id === currentUser.id && newRole !== "ADMIN") {
      alert("No puedes quitarte el rol de Administrador a ti mismo.");
      return;
    }
    const updated = { ...user, rol: newRole };
    onUpdateUser(updated);
    showFeedback(`Rol de ${user.nombre} actualizado a ${newRole}.`);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUser || !changePasswordValue.trim()) return;

    const updated = { ...passwordModalUser, password: changePasswordValue.trim() };
    onUpdateUser(updated);
    setPasswordModalUser(null);
    setChangePasswordValue("");
    showFeedback(`Contraseña actualizada para ${passwordModalUser.nombre}.`);
  };

  const handleExecuteTransfer = () => {
    if (!transferSourceUserId || !transferTargetUserId) {
      alert("Debes seleccionar el colaborador origen y el colaborador destino.");
      return;
    }
    if (transferSourceUserId === transferTargetUserId) {
      alert("El colaborador origen y destino no pueden ser el mismo.");
      return;
    }

    const sourceUser = users.find((u) => u.id === transferSourceUserId);
    const targetUser = users.find((u) => u.id === transferTargetUserId);
    if (!sourceUser || !targetUser) return;

    const clientCount = leads.filter((l) => l.asignadoAId === transferSourceUserId).length;
    if (clientCount === 0) {
      alert(`${sourceUser.nombre} no tiene clientes asignados para transferir.`);
      return;
    }

    if (
      !confirm(
        `¿Confirmas la transferencia de ${clientCount} cliente(s) de ${sourceUser.nombre} a ${targetUser.nombre}?`
      )
    ) {
      return;
    }

    if (onAssignLead) {
      leads
        .filter((l) => l.asignadoAId === transferSourceUserId)
        .forEach((l) => {
          onAssignLead(l.id, targetUser.id, targetUser.nombre);
        });
    }

    showFeedback(
      `¡Cartera transferida! Se reasignaron ${clientCount} cliente(s) a ${targetUser.nombre}.`
    );
    setTransferSourceUserId("");
    setTransferTargetUserId("");
  };

  const menuItems = [
    {
      id: "directory" as ManagementSection,
      label: "Directorio de Colaboradores",
      desc: "Lista y gestión de accesos",
      icon: Users,
      badge: users.length,
    },
    {
      id: "create" as ManagementSection,
      label: "Registrar Nuevo Usuario",
      desc: "Alta de cuentas y credenciales",
      icon: UserPlus,
    },
    {
      id: "roles" as ManagementSection,
      label: "Matriz de Permisos (RBAC)",
      desc: "Alcance por tipo de usuario",
      icon: Shield,
    },
    {
      id: "security" as ManagementSection,
      label: "Seguridad & Contraseñas",
      desc: "Cambio de claves y accesos",
      icon: Key,
    },
    {
      id: "transfer" as ManagementSection,
      label: "Ceder Cartera Comercial",
      desc: "Reasignación masiva de clientes",
      icon: ArrowLeftRight,
      badge: leads.length,
    },
    {
      id: "audit" as ManagementSection,
      label: "Auditoría & Actividad",
      desc: "Últimas sesiones y estados",
      icon: Clock,
      badge: `${activeCount}/${users.length}`,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2.5 shadow-xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Top Banner Card */}
      <div className="glass-panel border border-slate-800 rounded-3xl p-6 relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-purple-950/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Shield className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  Gestión y Administración de Usuarios
                  <span className="text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 font-bold">
                    Control RBAC Total
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Control centralizado de colaboradores de Mercury CAD, roles, permisos y carteras comerciales.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection("create")}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all flex items-center gap-2 active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Nuevo Colaborador</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Usuarios Activos
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {activeCount} <span className="text-xs font-normal text-slate-500">/ {users.length}</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider block">
              Administradores
            </span>
            <div className="text-2xl font-black text-white mt-1">{adminCount}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider block">
              Comerciales / Ventas
            </span>
            <div className="text-2xl font-black text-white mt-1">{comercialCount}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider block">
              Project Managers
            </span>
            <div className="text-2xl font-black text-white mt-1">{pmCount}</div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Structure: Sidebar Menu + Work Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Menu */}
        <div className="space-y-2">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Menú de Funciones
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? "border-purple-500 bg-purple-950/40 text-purple-200 shadow-lg shadow-purple-950/40"
                    : "border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`p-2 rounded-xl border mt-0.5 ${
                      isSelected
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-bold text-xs block text-white">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {item.desc}
                    </span>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isSelected
                        ? "bg-purple-500/30 text-purple-200 border border-purple-400/30"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Work Panel */}
        <div className="lg:col-span-3">
          {/* SECTION 1: DIRECTORY */}
          {activeSection === "directory" && (
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>Equipo de Trabajo Mercury CAD ({filteredUsers.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Modifique roles, suspenda o active cuentas y gestione las credenciales del equipo.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar colaborador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* Role filter buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: "ALL", label: `Todos (${users.length})` },
                  { id: "ADMIN", label: `Admins (${adminCount})` },
                  { id: "COMERCIAL", label: `Comerciales (${comercialCount})` },
                  { id: "PROJECT_MANAGER", label: `Project Managers (${pmCount})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedRoleFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      selectedRoleFilter === f.id
                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                        : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Colaborador</th>
                      <th className="py-3 px-3">Cargo</th>
                      <th className="py-3 px-3">Rol (RBAC)</th>
                      <th className="py-3 px-3">Estado</th>
                      <th className="py-3 px-3">Último Acceso</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
                    {filteredUsers.map((u) => {
                      const isCurrent = u.id === currentUser.id;
                      return (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"}
                                alt={u.nombre}
                                className="w-8 h-8 rounded-xl object-cover border border-slate-700 bg-slate-800 shrink-0"
                              />
                              <div>
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  <span>{u.nombre}</span>
                                  {isCurrent && (
                                    <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-1.5 py-0.2 rounded font-bold">
                                      Tú
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-slate-500" />
                                  <span>{u.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-3 text-slate-300 font-medium">
                            {u.cargo || "Especialista"}
                          </td>

                          <td className="py-3.5 px-3">
                            <select
                              value={u.rol}
                              disabled={isCurrent}
                              onChange={(e) => handleChangeRole(u, e.target.value as UserRole)}
                              className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer transition-all ${
                                u.rol === "ADMIN"
                                  ? "bg-purple-950 text-purple-200 border-purple-500/40"
                                  : u.rol === "COMERCIAL"
                                  ? "bg-blue-950 text-blue-200 border-blue-500/40"
                                  : "bg-emerald-950 text-emerald-200 border-emerald-500/40"
                              } ${isCurrent ? "cursor-not-allowed opacity-80" : ""}`}
                            >
                              <option value="ADMIN">ADMIN</option>
                              <option value="COMERCIAL">COMERCIAL</option>
                              <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-3">
                            <button
                              onClick={() => handleToggleActive(u)}
                              disabled={isCurrent}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                                u.activo
                                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/30 hover:bg-red-950/40 hover:text-red-300"
                                  : "bg-red-950/60 text-red-300 border-red-500/30 hover:bg-emerald-950/40 hover:text-emerald-300"
                              } ${isCurrent ? "cursor-not-allowed opacity-75" : ""}`}
                              title={isCurrent ? "Tu usuario principal de admin no puede deshabilitarse" : "Clic para cambiar estado"}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  u.activo ? "bg-emerald-400" : "bg-red-400"
                                }`}
                              />
                              {u.activo ? "Activo" : "Suspendido"}
                            </button>
                          </td>

                          <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                            {u.ultimoAcceso || "Sin registro"}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setPasswordModalUser(u);
                                  setChangePasswordValue(u.password || "");
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-950/30 transition-colors"
                                title="Cambiar contraseña"
                              >
                                <Key className="w-4 h-4" />
                              </button>
                              {!isCurrent && (
                                <button
                                  onClick={() => {
                                    if (confirm(`¿Eliminar definitivamente a ${u.nombre}?`)) {
                                      onDeleteUser(u.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                                  title="Eliminar usuario"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 2: CREATE USER */}
          {activeSection === "create" && (
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-in fade-in">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-purple-400" />
                  <span>Registrar Nuevo Colaborador</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete los datos de la cuenta. El colaborador podrá acceder inmediatamente con el rol y contraseña asignados.
                </p>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Carolina Morales"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Correo Electrónico Corporativo
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="cmorales@mercurycad.com.ar"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cargo / Especialidad
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Diseñadora Senior UX/UI o Ejecutivo de Ventas"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Rol y Nivel de Acceso
                  </label>
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value as UserRole)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-purple-500 font-semibold"
                  >
                    <option value="COMERCIAL">COMERCIAL (Ventas, Cartera propia, Leads y Cotizador)</option>
                    <option value="PROJECT_MANAGER">PROJECT_MANAGER (Operaciones, Abonos, Proyectos y Soporte)</option>
                    <option value="ADMIN">ADMIN (Acceso Total a todo el CRM y Configuración)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contraseña Inicial Provisoria
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-purple-300 font-mono outline-none focus:border-purple-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    El colaborador podrá ingresar inmediatamente con esta contraseña.
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveSection("directory")}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30 transition-all active:scale-95"
                  >
                    Confirmar y Crear Colaborador
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* SECTION 3: ROLES & RBAC MATRIX */}
          {activeSection === "roles" && (
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-in fade-in">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>Matriz de Permisos y Perfiles de Acceso (RBAC)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Reglas de seguridad y visibilidad establecidas para cada rol en Mercury CAD.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Admin Role */}
                <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-purple-300">ADMIN</span>
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                        Acceso Total
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      Destinado a la Dirección General. Control absoluto y supervisión global.
                    </p>
                    <ul className="text-xs text-slate-300 space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Vista 360° de toda la cartera de prospectos</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Ceder y reasignar clientes a cualquier agente</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Configurar Canales (WhatsApp, Correo, Meta)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Crear y suspender colaboradores y contraseñas</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Comercial Role */}
                <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-blue-300">COMERCIAL</span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                        Ventas & Clientes
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      Para ejecutivos de ventas y prospección. Foco en clientes propios.
                    </p>
                    <ul className="text-xs text-slate-300 space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Tablero y clientes asignados o propios</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Pipeline Kanban personal de negociación</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Cotizador CPQ y generación de propuestas</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-500 line-through">
                        <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>No ve los clientes de otros comerciales</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-500 line-through">
                        <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>No administra usuarios ni canales técnicos</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Project Manager Role */}
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-emerald-300">PROJECT_MANAGER</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        Operaciones & Tech
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      Para coordinadores de proyectos, diseño y desarrollo.
                    </p>
                    <ul className="text-xs text-slate-300 space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Control de Abonos Mensuales y Proyectos</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Seguimiento de entregables (Figma, GitHub)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Monitoreo de opiniones y tickets de soporte</span>
                      </li>
                      <li className="flex items-center gap-2 text-slate-500 line-through">
                        <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>No modifica credenciales ni configuración</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: SECURITY & PASSWORDS */}
          {activeSection === "security" && (
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl animate-in fade-in">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Seguridad & Credenciales de Acceso</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cambie contraseñas olvidadas o restablezca claves de acceso de cualquier colaborador.
                </p>
              </div>

              <div className="space-y-3">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                        {u.nombre.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white flex items-center gap-2">
                          <span>{u.nombre}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({u.email})</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Estado: {u.activo ? "Cuenta Activa" : "Suspendida"} • Rol: {u.rol}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setPasswordModalUser(u);
                        setChangePasswordValue(u.password || "");
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-amber-950/60 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 text-slate-300 transition-all flex items-center gap-1.5"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Cambiar Clave</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: TRANSFER PORTFOLIO */}
          {activeSection === "transfer" && (
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-in fade-in">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-blue-400" />
                  <span>Transferencia y Reasignación Masiva de Cartera</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ceda todos los clientes de un colaborador a otro en 1 solo clic (ideal por licencias, vacaciones o cambios de equipo).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                {/* Source User */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    1. Colaborador Origen (Quien cede los clientes):
                  </label>
                  <select
                    value={transferSourceUserId}
                    onChange={(e) => setTransferSourceUserId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="">Seleccione colaborador...</option>
                    {users.map((u) => {
                      const count = leads.filter((l) => l.asignadoAId === u.id).length;
                      return (
                        <option key={u.id} value={u.id}>
                          {u.nombre} ({count} clientes asignados)
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Target User */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    2. Colaborador Destino (Quien recibe los clientes):
                  </label>
                  <select
                    value={transferTargetUserId}
                    onChange={(e) => setTransferTargetUserId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="">Seleccione colaborador receptor...</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.rol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleExecuteTransfer}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#375EFB] to-[#2e3194] hover:from-[#476dfb] hover:to-[#375EFB] shadow-lg shadow-[#375EFB]/35 border border-white/20 transition-all flex items-center gap-2 active:scale-95 font-poppins"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Transferir Toda la Cartera</span>
                </button>
              </div>
            </div>
          )}

          {/* SECTION 6: AUDIT */}
          {activeSection === "audit" && (
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl animate-in fade-in">
              <div className="pb-4 border-b border-slate-800">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Registro de Actividad y Auditoría de Cuentas</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Monitoreo de últimas conexiones y actividad de los usuarios en Mercury CAD.
                </p>
              </div>

              <div className="divide-y divide-slate-800/80">
                {users.map((u) => (
                  <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          u.activo ? "bg-emerald-400" : "bg-red-400"
                        }`}
                      />
                      <div>
                        <span className="font-bold text-white block">{u.nombre}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-300 font-medium block">
                        {u.ultimoAcceso || "Sin registro"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ID: {u.id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Reset Modal */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="glass-panel border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Key className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-sm text-white">Cambiar Contraseña</h4>
                  <p className="text-[11px] text-slate-400">Para {passwordModalUser.nombre}</p>
                </div>
              </div>

              <button
                onClick={() => setPasswordModalUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={changePasswordValue}
                    onChange={(e) => setChangePasswordValue(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none focus:border-amber-500"
                    placeholder="Ingrese nueva clave..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-600/30 transition-all"
                >
                  Guardar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
