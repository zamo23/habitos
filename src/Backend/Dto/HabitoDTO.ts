export interface HabitoDTO {
    titulo: string;
    tipo: 'hacer' | 'dejar';
    id_grupo?: string | null;
}

interface Grupo {
    id: string;
    nombre: string;
}

export interface HabitoRespuestaDTO {
    id: string;
    titulo: string;
    tipo: 'hacer' | 'dejar';
    archivado: boolean;
    es_grupal: boolean;
    grupo?: Grupo;
}

export interface UsuarioClerkDTO {
    id_clerk: string;
    correo: string;
    nombre_completo: string;
    url_imagen: string;
    idioma: string;
    zona_horaria: string;
    cierre_dia_hora: number;
}
