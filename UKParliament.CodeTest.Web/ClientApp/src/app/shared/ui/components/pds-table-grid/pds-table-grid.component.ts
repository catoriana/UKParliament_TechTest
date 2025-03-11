// table-grid.component.ts
import { Component, EventEmitter, Input, Output, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

export interface TableColumn {
  header: string;
  field: string;
  hideOnMobile?: boolean;
  format?: (value: any) => string;
  isAction?: boolean;
}

@Component({
  selector: 'app-pds-table-grid',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './pds-table-grid.component.html',
  styleUrls: ['./pds-table-grid.component.scss']
})
export class PdsTableGridComponent {
  @Input() title: string = '';
  @Input() items: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() itemsPerPage: number = 6;
  @Input() tableClasses: string = 'table table-striped table-hover';
  @Input() theadClass: string = 'table-primary';
  @Input() emptyMessage: string = 'No data available.';
  @Input() selectedItemId: any = null;
  
  @Output() itemSelected = new EventEmitter<any>();
  @Output() itemAction = new EventEmitter<{item: any, action: string}>();
  
  @ContentChild('actionButtons') actionButtonsTemplate!: TemplateRef<any>;
  
  currentPage: number = 1;
  
  selectItem(item: any): void {
    this.itemSelected.emit(item);
  }
  
  onAction(item: any, action: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.itemAction.emit({item, action});
  }
  
  getFieldValue(item: any, field: string): any {
    // Handle nested properties like 'department.name'
    return field.split('.').reduce((obj, key) => 
      (obj && obj[key] !== undefined) ? obj[key] : null, item);
  }
  
  defaultEditAction(item: any, event: Event): void {
    this.onAction(item, 'edit', event);
  }
}