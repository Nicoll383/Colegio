// Definición de roles del sistema
const ROLES = {
  ADMIN: 'Administrador',
  SECRETARIA: 'Secretaria',
  DOCENTE: 'Docente',
  PADRE: 'Padre',
  FINANZAS: 'Finanzas'
};

// Permisos por rol
const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'usuarios.*',
    'estudiantes.*',
    'matriculas.*',
    'cursos.*',
    'reportes.*',
    'configuracion.*',
    'pagos.*'
  ],
  [ROLES.SECRETARIA]: [
    'estudiantes.*',
    'matriculas.*',
    'cursos.read',
    'cursos.assign',
    'reportes.read',
    'pagos.*'
  ],
  [ROLES.DOCENTE]: [
    'estudiantes.read',
    'cursos.read',
    'cursos.view_students',
    'reportes.read'
  ],
  [ROLES.PADRE]: [
    'estudiantes.read_own',
    'estudiantes.update_own',
    'matriculas.create',
    'matriculas.read_own',
    'pagos.read_own',
    'pagos.pay'
  ],
  [ROLES.FINANZAS]: [
    'pagos.*',
    'reportes.read',
    'reportes.financial',
    'estudiantes.read'
  ]
};

// Verificar si un rol tiene un permiso específico
const hasPermission = (role, permission) => {
  const rolePermissions = PERMISSIONS[role] || [];

  return rolePermissions.some(p => {
    if (p === permission) return true;

    // Verificar permisos con wildcard
    const regex = new RegExp('^' + p.replace('*', '.*') + '$');
    return regex.test(permission);
  });
};

module.exports = {
  ROLES,
  PERMISSIONS,
  hasPermission
};
