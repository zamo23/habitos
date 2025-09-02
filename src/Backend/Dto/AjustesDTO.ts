export interface TimezoneDTO {
    value: string;
    label: string;
    offset: string;
}

export interface UsuarioAjustesDTO {
    id_clerk: string;
    correo: string;
    nombre_completo: string;
    url_imagen: string;
    idioma: string;
    zona_horaria: string;
    cierre_dia_hora: number;
}

export interface DetectTimezoneRequest {
    offset_minutes: number;
}

export interface DetectTimezoneResponse {
    suggested_timezone: string;
    offset_minutes: number;
}

export interface ErrorResponse {
    error: {
        code: string;
        message: string;
    }
}
