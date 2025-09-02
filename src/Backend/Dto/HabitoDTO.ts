export interface HabitoDTO {
    titulo: string;
    tipo: 'hacer' | 'dejar';
    id_grupo?: string | null;
}

export interface HabitoRespuestaDTO {
    id: string;
    titulo: string;
    tipo: 'hacer' | 'dejar';
    archivado: boolean;
    es_grupal: boolean;
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
