import { QuizConfig } from './quiz-config';
import { Question } from './question';

export class Quiz {
            "id": string;
            "year":string;
            "class_teacher_subject_pk_id": string;
            "branch_id": string;
            "class_id": string;
            "class_name":string;
            "created": Date;
            "created_by": string;
            "dept_id":string;
            "end_time": null;
            "exam_published_date": Date;
            "exam_type": string;
            "exam_type_name": string;
            "is_active": boolean;
            "is_exam_published":boolean;
            "name": string;
            "per_page_total_question": string;
            "period_in_minute": string;
            "remarks": string;
            "score": string;
            "obtained_score" : string;
            "start_time":string;
            "subject_name": string;
            "teacehr_name": string;
            "teacher_id": string;
            "updated_by": string;
            "config" : QuizConfig;
            "questions": Question [];
            "student_id_vw" : string;
            "student_name_vw" : string

    constructor(data: any) {
        if (data) {
            this.id = data.result.id;
            this.name = data.result.name;
            this.config = new QuizConfig(data.config);
            this.year = data.result.year,
            this.class_teacher_subject_pk_id= data.result.class_teacher_subject_pk_id;
            this.branch_id= data.result.branch_id;
            this.class_id= data.result.class_id;
            this.class_name= data.result.class_name;
            this.created= data.result.created;
            this.created_by= data.result.created_by;
            this.dept_id= data.result.dept_id;
            this.end_time= data.result.end_time;
            this.exam_published_date= data.result.exam_published_date;
            this.exam_type= data.result.exam_type;
            this.exam_type_name= data.result.exam_type_name;
            this.is_active= data.result.is_active;
            this.is_exam_published= data.result.is_exam_published;
            this.per_page_total_question= data.result.per_page_total_question;
            this.period_in_minute= data.result.period_in_minute;
            this.remarks= data.result.remarks
            this.score= data.result.score;
            this.obtained_score = data.result.obtained_score; //// view purpose
            this.teacehr_name = data.teacehr_name;
            this.subject_name = data.subject_name;

            this.questions = [];
            data.result.questions.forEach(q => {
                this.questions.push(new Question(q));
            });

            this.student_id_vw = ''
            this.student_name_vw = ''


        }
    }
}
