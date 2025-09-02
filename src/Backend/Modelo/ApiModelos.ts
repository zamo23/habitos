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
