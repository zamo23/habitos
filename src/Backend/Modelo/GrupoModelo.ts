export class GrupoModelo {
    id: string;
    nombre: string;
    descripcion?: string;
    id_creador: string;
    fecha_creacion: string;

    constructor(
        nombre: string,
        id_creador: string,
        descripcion?: string,
    ) {
        this.id = `group_${crypto.randomUUID()}`;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.id_creador = id_creador;
        this.fecha_creacion = new Date().toISOString();
    }
}

export class InvitacionGrupoModelo {
    id: string;
    id_grupo: string;
    correo: string;
    estado: 'pendiente' | 'aceptada' | 'rechazada';
    fecha_invitacion: string;
    fecha_respuesta?: string;

    constructor(
        id_grupo: string,
        correo: string,
    ) {
        this.id = `invite_${crypto.randomUUID()}`;
        this.id_grupo = id_grupo;
        this.correo = correo;
        this.estado = 'pendiente';
        this.fecha_invitacion = new Date().toISOString();
    }
}

export class MiembroGrupoModelo {
    id: string;
    id_usuario: string;
    id_grupo: string;
    nombre_usuario: string;
    correo_usuario: string;
    url_imagen?: string;
    rol: 'admin' | 'miembro';
    fecha_union: string;

    constructor(
        id_usuario: string,
        id_grupo: string,
        nombre_usuario: string,
        correo_usuario: string,
        url_imagen?: string,
        rol: 'admin' | 'miembro' = 'miembro'
    ) {
        this.id = `member_${crypto.randomUUID()}`;
        this.id_usuario = id_usuario;
        this.id_grupo = id_grupo;
        this.nombre_usuario = nombre_usuario;
        this.correo_usuario = correo_usuario;
        this.url_imagen = url_imagen;
        this.rol = rol;
        this.fecha_union = new Date().toISOString();
    }
}
