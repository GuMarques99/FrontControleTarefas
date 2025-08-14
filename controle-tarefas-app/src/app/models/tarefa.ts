export class Tarefa {
    id: number;
    titulo: string;
    descricao: string;
    status: number;
    statusStr: string;
    dataCriacao: Date;
    dataAlteracao: Date | null;

    constructor(
        id: number = 0, 
        titulo: string = "", 
        descricao: string = "", 
        status: number = 0, 
        statusStr: string = "", 
        dataCriacao: Date = new Date(),
        dataAlteracao: Date | null,
    ) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.status = status;
        this.statusStr = statusStr;
        this.dataCriacao = dataCriacao;
        this.dataAlteracao = dataAlteracao;
    }

}