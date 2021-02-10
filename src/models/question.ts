import { Option } from './option';

export class Question {
    "id": string;
    "action_date": Date;
    "action_type": string;
    "answer": string;
    "answer_limit": string;
    "questionTypeId": string;
    "answer_with_type_name": string;
    "branch_id": string;
    "class_id": string;
    "class_name": string;
    "created": Date;
    "created_by": string;
    "dept_id": string;
    "is_active": boolean;
    "options": Option [];
    "name": string;
    "score": string;
    "subject_name": string;
    "teacehr_name": string;
    "teacher_id": string;
    "updated_by": string;
    "score_against_answer_vw" : string;
    "std_answer_vw" : string;
    "serial_no" : string;

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.name = data.question;
        this.questionTypeId = data.answer_with_type;
        this.action_date = data.action_date;
        this.action_type = data.action_type;
        this.answer = data.answer;
        this.answer_limit = data.answer_limit;
        this.answer_with_type_name = data.answer_with_type_name;
        this.branch_id = data.branch_id;
        this.class_id = data.class_id;
        this.class_name = data.class_name;
        this.created = data.created;
        this.created_by = data.created_by;
        this.dept_id = data.dept_id;
        this.is_active = data.is_active;
        this.score = data.score;
        this.subject_name = data.subject_name;
        this.teacehr_name = data.teacehr_name;
        this.teacher_id = data.teacher_id;
        this.updated_by = data.updated_by;
        this.serial_no = data.serial_no;
        
        this.score_against_answer_vw = '';
        this.std_answer_vw = '';

        this.options = [];
        if (data.answer_with_type === "1") {
            if (data.mcq_optinos) {
                let mcqOrder = ["A","B","C","D"]
                data.mcq_optinos.forEach((o, i) => {
                    this.options.push(new Option(o, mcqOrder[i]));
                });
            }
        }
    }
}
