import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(tasks: any[], currentUser: any): any[] {
    if (!tasks || !currentUser) return [];

    if (currentUser.role === 'admin') {
      return tasks; // Admin sees all tasks
    } else {
      return tasks.filter(task => task.ownerId  === currentUser.id); // User sees only their own tasks
    }
  }
}
//   transform(items: any[], filter: { [key: string]: any }): any[] {
//     if (!items || !filter) return items;
//     return items.filter(item => Object.keys(filter).every(key => item[key] === filter[key]));
//   }
// }
