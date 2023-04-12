import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TaskModel } from '../../models/task.model';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  @Input() task!: TaskModel | null;
  @Output() timerCompleted = new EventEmitter<void>();
  counter: { min: number; sec: number } = { min: 0, sec: 0 };

  constructor() {}

  ngOnInit() {}

  startTimer() {
    if (!this.task) {
      console.log('No task provided');
      return;
    }

    const timeLengthInMinutes = this.task.timeLength;
    this.counter = { min: timeLengthInMinutes, sec: 0 };

    let intervalId = setInterval(() => {
      if (this.counter.sec - 1 == -1) {
        this.counter.min -= 1;
        this.counter.sec = 59;
      } else this.counter.sec -= 1;
      if (this.counter.min === 0 && this.counter.sec == 0) {
        clearInterval(intervalId);
        this.timerCompleted.emit(); // Emit the event when the timer has completed
      }
    }, 1000);
  }
}
