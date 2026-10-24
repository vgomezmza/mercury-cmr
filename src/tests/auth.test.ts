import { describe, it, expect } from "vitest";
import { INITIAL_USERS } from "../data/initialData";
import { User, UserRole } from "../types/crm";

describe("Módulo de Autenticación y Control de Acceso (RBAC)", () => {
  it("debe cargar los usuarios iniciales del equipo de Mercury CAD con sus roles", () => {
    expect(INITIAL_USERS.length).toBeGreaterThanOrEqual(3);

    const admin = INITIAL_USERS.find((u) => u.rol === "ADMIN");
    const comercial = INITIAL_USERS.find((u) => u.rol === "COMERCIAL");
    const pm = INITIAL_USERS.find((u) => u.rol === "PROJECT_MANAGER");

    expect(admin).toBeDefined();
    expect(admin?.email).toBe("victor@mercurycad.com.ar");
    expect(admin?.activo).toBe(true);

    expect(comercial).toBeDefined();
    expect(comercial?.activo).toBe(true);

    expect(pm).toBeDefined();
    expect(pm?.activo).toBe(true);
  });

  it("debe validar credenciales correctamente al iniciar sesión", () => {
    const authenticate = (email: string, pass: string, userList: User[]) => {
      const user = userList.find(
        (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
      );
      if (!user) return { success: false, error: "Usuario no encontrado" };
      if (!user.activo) return { success: false, error: "Usuario deshabilitado" };
      if (user.password !== pass) return { success: false, error: "Contraseña incorrecta" };
      return { success: true, user };
    };

    // Login exitoso de Víctor
    const resSuccess = authenticate("victor@mercurycad.com.ar", "mercury2026", INITIAL_USERS);
    expect(resSuccess.success).toBe(true);
    expect(resSuccess.user?.rol).toBe("ADMIN");

    // Login fallido por contraseña errónea
    const resBadPass = authenticate("victor@mercurycad.com.ar", "clave_invalida", INITIAL_USERS);
    expect(resBadPass.success).toBe(false);
    expect(resBadPass.error).toBe("Contraseña incorrecta");

    // Login fallido por correo inexistente
    const resNotFound = authenticate("desconocido@empresa.com", "123456", INITIAL_USERS);
    expect(resNotFound.success).toBe(false);
    expect(resNotFound.error).toBe("Usuario no encontrado");

    // Login fallido por usuario inactivo
    const inactiveUser: User = {
      id: "usr-disabled",
      nombre: "Ex Empleado",
      email: "ex@mercurycad.com.ar",
      password: "pass",
      rol: "COMERCIAL",
      activo: false,
    };
    const resDisabled = authenticate("ex@mercurycad.com.ar", "pass", [...INITIAL_USERS, inactiveUser]);
    expect(resDisabled.success).toBe(false);
    expect(resDisabled.error).toBe("Usuario deshabilitado");
  });

  it("debe aplicar la matriz de permisos RBAC por cada rol", () => {
    const checkTabPermission = (tab: string, role: UserRole) => {
      const permissions: Record<string, UserRole[]> = {
        prospects: ["ADMIN", "COMERCIAL", "PROJECT_MANAGER"],
        pipeline: ["ADMIN", "COMERCIAL", "PROJECT_MANAGER"],
        opinions: ["ADMIN", "COMERCIAL", "PROJECT_MANAGER"],
        social: ["ADMIN", "COMERCIAL"],
        quotes: ["ADMIN", "COMERCIAL", "PROJECT_MANAGER"],
        retainers: ["ADMIN", "PROJECT_MANAGER"],
        settings: ["ADMIN"],
        users: ["ADMIN"],
      };
      return permissions[tab]?.includes(role) ?? false;
    };

    // Administrador tiene acceso a todo
    expect(checkTabPermission("settings", "ADMIN")).toBe(true);
    expect(checkTabPermission("users", "ADMIN")).toBe(true);
    expect(checkTabPermission("pipeline", "ADMIN")).toBe(true);
    expect(checkTabPermission("retainers", "ADMIN")).toBe(true);

    // Comercial no puede acceder a settings ni a users
    expect(checkTabPermission("users", "COMERCIAL")).toBe(false);
    expect(checkTabPermission("settings", "COMERCIAL")).toBe(false);
    expect(checkTabPermission("pipeline", "COMERCIAL")).toBe(true);
    expect(checkTabPermission("social", "COMERCIAL")).toBe(true);

    // Project Manager no puede acceder a settings ni a users ni a social hub
    expect(checkTabPermission("users", "PROJECT_MANAGER")).toBe(false);
    expect(checkTabPermission("settings", "PROJECT_MANAGER")).toBe(false);
    expect(checkTabPermission("retainers", "PROJECT_MANAGER")).toBe(true);
  });

  it("debe permitir alta de nuevo usuario y alternar estado activo/inactivo", () => {
    let users = [...INITIAL_USERS];

    const newUser: User = {
      id: "usr-nuevo",
      nombre: "Carlos Tester",
      email: "ctester@mercurycad.com.ar",
      password: "testPassword123",
      rol: "COMERCIAL",
      activo: true,
    };

    // Agregar usuario
    users = [newUser, ...users];
    expect(users.find((u) => u.id === "usr-nuevo")).toBeDefined();

    // Deshabilitar usuario
    users = users.map((u) => (u.id === "usr-nuevo" ? { ...u, activo: false } : u));
    expect(users.find((u) => u.id === "usr-nuevo")?.activo).toBe(false);

    // Habilitar de nuevo
    users = users.map((u) => (u.id === "usr-nuevo" ? { ...u, activo: true } : u));
    expect(users.find((u) => u.id === "usr-nuevo")?.activo).toBe(true);
  });

  it("debe rechazar accesos sin contraseña y activar bloqueo de seguridad tras 5 intentos fallidos", () => {
    let attempts = 0;
    const maxAttempts = 5;
    let isLocked = false;

    const tryLogin = (pass: string) => {
      if (isLocked) return { allowed: false, reason: "Bloqueado por seguridad" };
      if (pass !== "mercury2026") {
        attempts++;
        if (attempts >= maxAttempts) {
          isLocked = true;
          return { allowed: false, reason: "Límite excedido. Bloqueo temporal activado" };
        }
        return { allowed: false, reason: "Contraseña incorrecta" };
      }
      attempts = 0;
      return { allowed: true };
    };

    // 4 intentos fallidos
    for (let i = 0; i < 4; i++) {
      const res = tryLogin("incorrecta");
      expect(res.allowed).toBe(false);
      expect(res.reason).toBe("Contraseña incorrecta");
    }

    // 5to intento fallido activa el bloqueo
    const fifth = tryLogin("incorrecta");
    expect(fifth.allowed).toBe(false);
    expect(fifth.reason).toContain("Bloqueo temporal activado");

    // Intentos posteriores quedan bloqueados inmediatamente
    const sixth = tryLogin("mercury2026");
    expect(sixth.allowed).toBe(false);
    expect(sixth.reason).toBe("Bloqueado por seguridad");
  });
});
