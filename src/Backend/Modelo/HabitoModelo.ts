export class HabitoModelo {
    id: string;
    titulo: string;
    tipo: 'hacer' | 'dejar';
    archivado: boolean;
    es_grupal: boolean;
    id_grupo?: string | null;
    id_usuario: string;

    constructor(
        titulo: string,
        tipo: 'hacer' | 'dejar',
        id_usuario: string,
        id_grupo?: string | null
    ) {
        this.id = `habit_${crypto.randomUUID()}`;
        this.titulo = titulo;
        this.tipo = tipo;
        this.archivado = false;
        this.es_grupal = !!id_grupo;
        this.id_grupo = id_grupo;
        this.id_usuario = id_usuario;
    }
}
