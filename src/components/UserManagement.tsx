"use client";

import React, { useState } from "react";
import { User, UserRole } from "../types/crm";
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Check,
  X,
  Key,
  Mail,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Lock,
  UserX,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

interface UserManagementProps {
  users: User[];
  onAddUser: (newUser: User) => void;
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: string) => void;
  currentUser: User;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  currentUser,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordModalUser, setPasswordModalUser] = useState<User | null>(null);
  const [changePasswordValue, setChangePasswordValue] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("mercury2026");
  const [rol, setRol] = useState<UserRole>("COMERCIAL");
  const [cargo, setCargo] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) return;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      password: password || "mercury2026",
      rol,
      cargo: cargo.trim() || (rol === "ADMIN" ? "Administrador" : rol === "COMERCIAL" ? "Ejecutivo Comercial" : "Project Manager"),
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 50000)}?w=100&h=100&fit=crop`,
      activo: true,
      ultimoAcceso: "Registrado recientemente",
    };

    onAddUser(newUser);
    setIsModalOpen(false);
    setNombre("");
    setEmail("");
    setCargo("");
    setFeedbackMessage(`Usuario ${newUser.nombre} creado con éxito.`);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleToggleActive = (user: User) => {
    if (user.id === currentUser.id) {
      alert("No puedes deshabilitar tu propia cuenta activa de administrador.");
      return;
    }
    const updated = { ...user, activo: !user.activo };
    onUpdateUser(updated);
    setFeedbackMessage(
      `Usuario ${user.nombre} ${updated.activo ? "activado" : "deshabilitado"}.`
    );
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleChangeRole = (user: User, newRole: UserRole) => {
    if (user.id === currentUser.id && newRole !== "ADMIN") {
      alert("No puedes quitarte el rol de Administrador a ti mismo.");
      return;
    }
    const updated = { ...user, rol: newRole };
    onUpdateUser(updated);
    setFeedbackMessage(`Rol de ${user.nombre} actualizado a ${newRole}.`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const activeCount = users.filter((u) => u.activo).length;
  const adminCount = users.filter((u) => u.rol === "ADMIN").length;
  const comercialCount = users.filter((u) => u.rol === "COMERCIAL").length;
  const pmCount = users.filter((u) => u.rol === "PROJECT_MANAGER").length;

  return (
    <div className="space-y-6">
      {/* Feedback Alert */}
      {feedbackMessage && (
        <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="glass-panel border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Gestión y Administración de Usuarios
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 font-semibold">
                    Control de Acceso RBAC
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Administre los colaboradores de Mercury CAD, sus roles, permisos y credenciales.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 border border-purple-400/30 transition-all flex items-center gap-2 active:scale-95 self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Nuevo Usuario</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Usuarios Activos
            </span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {activeCount} <span className="text-xs font-normal text-slate-500">/ {users.length}</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
              Administradores
            </span>
            <div className="text-2xl font-black text-white mt-1">{adminCount}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
              Comerciales / Ventas
            </span>
            <div className="text-2xl font-black text-white mt-1">{comercialCount}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
              Project Managers
            </span>
            <div className="text-2xl font-black text-white mt-1">{pmCount}</div>
          </div>
        </div>
      </div>

      {/* Users Directory Table */}
      <div className="glass-panel border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Equipo de Trabajo Mercury CAD ({users.length})
          </h3>
          <span className="text-xs text-slate-400">
            Sesión actual: <strong className="text-white">{currentUser.nombre}</strong> ({currentUser.rol})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900/70 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="py-3 px-4">Usuario / Colaborador</th>
                <th className="py-3 px-4">Correo Electrónico</th>
                <th className="py-3 px-4">Cargo / Función</th>
                <th className="py-3 px-4">Rol en el Sistema</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Último Acceso</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => {
                const isCurrent = u.id === currentUser.id;
                return (
                  <tr
                    key={u.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      !u.activo ? "opacity-60 bg-red-950/10" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt={u.nombre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-white bg-slate-700">
                              {u.nombre.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-100 flex items-center gap-1.5">
                            {u.nombre}
                            {isCurrent && (
                              <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded-full font-bold">
                                Tú
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-500">ID: {u.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                      {u.email}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {u.cargo || "Especialista"}
                    </td>

                    <td className="py-3.5 px-4">
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

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(u)}
                        disabled={isCurrent}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                          u.activo
                            ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/30 hover:bg-red-950/40 hover:text-red-300"
                            : "bg-red-950/60 text-red-300 border-red-500/30 hover:bg-emerald-950/40 hover:text-emerald-300"
                        } ${isCurrent ? "cursor-not-allowed" : ""}`}
                        title={
                          isCurrent
                            ? "No puedes deshabilitar tu propio usuario"
                            : u.activo
                            ? "Clic para suspender acceso"
                            : "Clic para habilitar acceso"
                        }
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.activo ? "bg-emerald-400" : "bg-red-400"
                          }`}
                        />
                        {u.activo ? "Activo" : "Deshabilitado"}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {u.ultimoAcceso || "Sin registro"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setPasswordModalUser(u);
                            setChangePasswordValue(u.password || "");
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-950/30 transition-colors"
                          title="Cambiar contraseña de este usuario"
                        >
                          <Key className="w-3.5 h-3.5" />
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
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Permissions Matrix Reference */}
      <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-purple-400" />
          Matriz de Permisos y Perfiles de Acceso (RBAC)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Admin Role */}
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-purple-300">ADMIN</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-semibold">
                  Acceso Total
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Destinado a la Dirección General (Víctor). Control absoluto del sistema y configuración.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Directorio & 200 Prospectos
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Pipeline Kanban & Negociación
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Cotizador CPQ & Abonos MRR
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Configurar Canales (IMAP/SMTP & APIs)
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Administrar Usuarios & Credenciales
                </li>
              </ul>
            </div>
          </div>

          {/* Comercial Role */}
          <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-blue-300">COMERCIAL</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold">
                  Ventas & Clientes
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Para ejecutivos comerciales y growth. Enfocado en prospección, seguimiento y cierre.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Directorio & 200 Prospectos
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Pipeline Kanban & Estados
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Social Hub (Facebook, IG, X, LinkedIn)
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Cotizador CPQ & Propuestas
                </li>
                <li className="flex items-center gap-1.5 text-slate-500 line-through">
                  <X className="w-3.5 h-3.5 text-red-400" />
                  Configuración Canales Técnicos
                </li>
                <li className="flex items-center gap-1.5 text-slate-500 line-through">
                  <X className="w-3.5 h-3.5 text-red-400" />
                  Gestión de Usuarios
                </li>
              </ul>
            </div>
          </div>

          {/* Project Manager Role */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-emerald-300">PROJECT_MANAGER</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                  Operaciones & Tech
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Para coordinadores de proyectos y UX leads. Enfoque en entregables, Figma y soporte.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Abonos Mensuales & Proyectos
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Control de Hitos & Horas de Soporte
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Monitoreo de Opiniones & Tickets
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Directorio de Contactos de Clientes
                </li>
                <li className="flex items-center gap-1.5 text-slate-500 line-through">
                  <X className="w-3.5 h-3.5 text-red-400" />
                  Configuración de Canales y Credenciales
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal to Register New User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel border border-slate-700 rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-purple-400" />
                Registrar Nuevo Colaborador
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cargo / Especialidad
                </label>
                <input
                  type="text"
                  placeholder="Ej: Diseñadora Senior UX/UI"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Rol en el Sistema
                </label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value as UserRole)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                >
                  <option value="COMERCIAL">COMERCIAL (Ventas & Leads)</option>
                  <option value="PROJECT_MANAGER">PROJECT_MANAGER (Operaciones & Tech)</option>
                  <option value="ADMIN">ADMIN (Acceso Total)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contraseña Temporal Inicial
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  El usuario podrá ingresar de inmediato con esta clave.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/30"
                >
                  Confirmar y Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {passwordModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Key className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Actualizar Contraseña
                  </h3>
                  <p className="text-xs text-slate-400">
                    Usuario: <strong className="text-slate-200">{passwordModalUser.nombre}</strong> ({passwordModalUser.email})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPasswordModalUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!changePasswordValue || changePasswordValue.length < 4) {
                  alert("La contraseña debe tener al menos 4 caracteres.");
                  return;
                }
                onUpdateUser({ ...passwordModalUser, password: changePasswordValue });
                setFeedbackMessage(`Contraseña de ${passwordModalUser.nombre} actualizada correctamente.`);
                setPasswordModalUser(null);
                setChangePasswordValue("");
                setTimeout(() => setFeedbackMessage(null), 3000);
              }}
              className="space-y-4 mt-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Nueva Contraseña</span>
                  <span className="text-[11px] text-slate-500">Mínimo 4 caracteres</span>
                </label>
                <div className="relative">
                  <input
                    type={showChangePassword ? "text" : "password"}
                    required
                    value={changePasswordValue}
                    onChange={(e) => setChangePasswordValue(e.target.value)}
                    placeholder="Ingrese la nueva clave"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(!showChangePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  >
                    {showChangePassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-600/30"
                >
                  Guardar Nueva Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
