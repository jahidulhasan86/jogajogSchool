export const exam_type_name: Exam_type[] = [
    { value: '1', viewValue: 'CT' },
    { value: '2', viewValue: 'First term' },
    { value: '3', viewValue: 'Second term' },
    { value: '4', viewValue: 'Final term' }
    ];

export interface Exam_type {
    value: string;
    viewValue: string;
}
