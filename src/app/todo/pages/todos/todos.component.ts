import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Todo } from '../../../models/Todo';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  todoForm: FormGroup = new FormGroup({
    body: new FormControl('', [ Validators.required ]),
    done: new FormControl(false)
  })

  todos: Todo[] = []

  constructor(
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTodos()
  }

  loadTodos(): void {

  }

  create(): void {

  }

  delete(todo: Todo): void {

  }

  toggleDone(todo: Todo): void {

  }

  signOut(): void {

  }
}