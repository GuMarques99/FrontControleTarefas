export class statusTarefa {
    id: number;
    descricao: String;
    permiteEscolher: Boolean;
    filtroDefault: Boolean

    constructor(id: number, descricao: String, permiteEscolher: Boolean, filtroDefault: Boolean) {
        this.id = id;
        this.descricao = descricao;
        this.permiteEscolher = permiteEscolher;
        this.filtroDefault = filtroDefault;
    }

    static listaStatusDefault(): statusTarefa[] {
        return [
            new statusTarefa(0, "Novo", false, true),
            new statusTarefa(1, "Em Andamento", true, true),
            new statusTarefa(2, "Paralisado", true, true),
            new statusTarefa(3, "Concluído", true, false),
            new statusTarefa(4, "Reaberto", false, true),
            new statusTarefa(5, "Excluído", false, false)
        ];
    }
}