export interface HabitoDetalles {
    id: string;
    titulo: string;
    tipo: 'hacer' | 'dejar';
    archivado: boolean;
    es_grupal: boolean;
    fecha_creacion: string;
    dias_desde_creacion: number;
    
    rachas: {
        actual: number;
        mejor: number;
    };
    
    estadisticas: {
        total_registros: number;
        total_exitos: number;
        total_fallos: number;
        tasa_exito: number;
        promedio_semanal: number;
        primer_registro: string;
        dias_desde_primer_registro: number;
    };
    
    registro_hoy: {
        completado: boolean;
        estado: 'exito' | 'fallo';
        comentario?: string;
        puede_registrar: boolean;
        fecha_local_usuario: string;
    };
    
    registros_recientes: Array<{
        id: string;
        fecha: string;
        estado: 'exito' | 'fallo';
        comentario?: string;
        dias_atras: number;
    }>;
}

export interface GrupoInvitacionRequest {
    correos: string[];
}

export interface InvitacionIndividual {
    id: number;
    token: string;
    correo_invitado: string;
    expira_en: string;
}

export interface InvitacionError {
    correo: string;
    error: string;
}

export interface GrupoInvitacionResponse {
    invitaciones: InvitacionIndividual[];
    errores: InvitacionError[];
    total_exitosas: number;
    total_errores: number;
}
