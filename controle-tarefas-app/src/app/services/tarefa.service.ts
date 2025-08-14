import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tarefa } from '../models/tarefa';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private readonly apiUrl = `${environment.apiUrl}/Tarefa`;

  constructor(private http: HttpClient) { }

  getAllTarefasAtivas(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.apiUrl}/ativos`);
  }

  getTarefasPorStatus(status: number[]): Observable<Tarefa[]> {
    const param = `?${status.map(st => `status=${st}`).join("&")}`
    return this.http.get<Tarefa[]>(`${this.apiUrl}/status${param}`);
  }

  getTarefa(id: number): Observable<Tarefa> {
    return this.http.get<Tarefa>(`${this.apiUrl}/${id}`);
  }

  criar(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.post<any>(this.apiUrl, tarefa);
  }

  atualizar(tarefa: Tarefa): Observable<Tarefa> {
    return this.http.put<Tarefa>(this.apiUrl, tarefa);
  }

  reabrir(id: number): Observable<Tarefa> {
    return this.http.put<Tarefa>(`${this.apiUrl}/reabrir/${id}`, {});
  }

  excluir(id: number): Observable<Tarefa> {
    return this.http.delete<Tarefa>(`${this.apiUrl}/${id}`);
  }
}
