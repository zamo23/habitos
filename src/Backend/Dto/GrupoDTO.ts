export interface GrupoDTO {
    nombre: string;
    descripcion?: string;
}

export interface GrupoRespuestaDTO {
    soy_rol: any;
    id: string;
    nombre: string;
    descripcion?: string;
    id_creador: string;
    fecha_creacion: string;
}

export interface HabitoGrupalDTO {
    titulo: string;
    tipo: 'hacer' | 'dejar';
}

export interface InvitacionGrupoDTO {
    correo: string;
    rol?: 'miembro' | 'administrador';
}

export interface InvitacionRespuestaDTO {
    id: string;
    id_grupo: string;
    correo: string;
    estado: 'pendiente' | 'aceptada' | 'rechazada';
    fecha_invitacion: string;
    fecha_respuesta?: string;
    expira_en?: string;
}

export interface MiembroGrupoDTO {
    id: string;
    id_usuario: string;
    id_grupo: string;
    nombre_usuario: string;
    correo_usuario: string;
    url_imagen?: string;
    rol: 'owner' | 'administrador' | 'miembro';
    fecha_union: string;
}
