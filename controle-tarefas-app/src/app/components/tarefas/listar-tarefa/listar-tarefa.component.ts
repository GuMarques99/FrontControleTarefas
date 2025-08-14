import { Component, inject, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tarefa } from '../../../models/tarefa';
import { TarefaService } from '../../../services/tarefa.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { statusTarefa } from '../../../models/status';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, Validators, ReactiveFormsModule, FormControl} from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-listar-tarefas',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatChipsModule, 
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './listar-tarefa.component.html',
  styleUrls: ['./listar-tarefa.component.scss'],
})
export class ListarTarefaComponent implements OnInit {
  tarefas: Tarefa[] = [];
  novaTarefa: Tarefa = new Tarefa(0, "", "", 0, "", new Date(), null);

  isCarregando: Boolean = false;

  statusSelecionado: number = 0;
  listaStatus: statusTarefa[] = statusTarefa.listaStatusDefault();
  tarefaEmEdicao: number = 0;
  filtrosDefault = this.listaStatus.filter(s => s.filtroDefault).map(s => s.id);
  statusFiltrados =  new FormControl(this.filtrosDefault, [Validators.required]);
  tituloValidator = new FormControl('', [Validators.required, Validators.minLength(2)]);
  tituloNovaTarefa = new FormControl('', [Validators.required, Validators.minLength(2)]);
  descricaoValidator = new FormControl('', [Validators.required, Validators.minLength(5)]);
  descricaoNovaTarefa = new FormControl('', [Validators.required, Validators.minLength(5)]);

  adicionandoTarefa: Boolean = false;
  
  @ViewChild('confirmacaoTemplate') confirmacaoTemplate!: TemplateRef<any>;
  private dialog = inject(MatDialog);


  constructor(private servico: TarefaService) {}

  ngOnInit(): void {
    this.getTarefasAtivas()
  }
  
  getTarefasAtivas(): void {
    this.isCarregando = true;
    this.servico.getAllTarefasAtivas().subscribe({
      next: response => {
        this.tarefas = response
        this.isCarregando = false;
      },
      error: error => {
        console.error(`Erro ao buscar tarefas com status`, error);        
        this.isCarregando = false;
      },      
    });    
  }

  getTarefasPorStatus(status: any): void {
    this.isCarregando = true;
    this.servico.getTarefasPorStatus(status).subscribe({
      next: response => {
        this.tarefas = response
        this.isCarregando = false;
      },
      error: error => {
        console.error(`Erro ao buscar tarefas com status`, error);        
        this.isCarregando = false;
      }
    }); 
  }
  
  filtrarPorStatus() {    
    if(!this.statusFiltrados.hasError("required")) {
      this.getTarefasPorStatus(this.statusFiltrados.value)
    }
  }

  recarregarTarefas() {
    if(!this.statusFiltrados.hasError("required")) {
      this.getTarefasPorStatus(this.statusFiltrados.value)
    } else {
      this.getTarefasAtivas()
    }
  }

  salvarEdicaoTarefa(tarefa: Tarefa) {    
    if(
      !this.tituloValidator.hasError('minlength') && 
      !this.tituloValidator.hasError('required') &&
      !this.descricaoValidator.hasError('minlength') && 
      !this.descricaoValidator.hasError('required')
    ) {
      this.isCarregando = true;
      this.servico.atualizar(tarefa).subscribe({
        next: response => {
          this.tarefaEmEdicao = 0;
          this.recarregarTarefas();
          this.isCarregando = false;
        },
        error: error => {
          console.error(`Erro ao buscar tarefas com status`, error);
          this.isCarregando = false;
        }
      })

    }
  }

  criarTarefa() {
    this.novaTarefa = new Tarefa(0, "", "", 0, "", new Date(), null);
    this.adicionandoTarefa = true;
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 0);
  }

  salvarNovaTarefa() {
    if(
      !this.tituloNovaTarefa.hasError('minlength') && 
      !this.tituloNovaTarefa.hasError('required') &&
      !this.descricaoNovaTarefa.hasError('minlength') && 
      !this.descricaoNovaTarefa.hasError('required')       
    ) {
      this.isCarregando = true;
      this.servico.criar(this.novaTarefa).subscribe({
        next: response => {
          this.novaTarefa = new Tarefa(0, "", "", 0, "", new Date(), null);
          this.adicionandoTarefa = false;
          this.recarregarTarefas();
        },
        error: error => {
          console.error(`Erro ao criar tarefa`, error);
          this.isCarregando = true;
        }
      })
    }
  }

  cancelarCriacao() {
    this.novaTarefa = new Tarefa(0, "", "", 0, "", new Date(), null);
    this.adicionandoTarefa = false;
  }

  editarTarefa(id: number) {
    this.tarefaEmEdicao = id;
  }

  cancelarEdicao() {
    this.tarefaEmEdicao = 0;
  }

  abrirConfirmacao() {
    const dialogRef = this.dialog.open(this.confirmacaoTemplate, {
      width: '350px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((resultado: boolean) => {
      dialogRef.close();
    });
  }

  excluirTarefa(id: number) {
    this.isCarregando = true;
    this.servico.excluir(id).subscribe({
      next: response => {
        this.tarefaEmEdicao = 0;
        this.recarregarTarefas();
        this.isCarregando = false;
      },
      error: error => {
        console.error(`Erro ao excluir`, error);
        this.isCarregando = false;
      }
    })
  }

  exclusaoConfirmada() {
    this.excluirTarefa(this.tarefaEmEdicao);
  }

  reabrirTarefa(id: number) {
    this.isCarregando = true;
    this.servico.reabrir(id).subscribe({
      next: response => {
        this.tarefaEmEdicao = 0;
        this.recarregarTarefas();
        this.isCarregando = false;
      },
      error: error => {
        console.error(`Erro ao reabrir`, error);
        this.isCarregando = false;
      }
    })
  }
}