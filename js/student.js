export default class Student {
  constructor (name, surname, lastname, studyStart, birthday, faculty, id) {
    this.name = name
    this.surname = surname
    this.lastname = lastname
    this.studyStart = studyStart
    this.birthday = birthday
    this.faculty = faculty
    this.id = id
  }

  get fio() {
    return this.surname + ' ' + this.name + ' ' + this.lastname;
  }

  getLearnPeriod() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    let currentDate = now.getDate();
    const learnYears = 4;
    const monthStudyStart = 9; 

    let course = currentYear - this.studyStart - (0 > (currentMonth - monthStudyStart || currentDate - 1));
    course = ++course > learnYears ? 'закончил' : `${course} курс`;
    let period = `${this.studyStart} - ${+this.studyStart + learnYears} (${course})`;

    return period;
  }

  getBirthDateString() {
    const yyyy = this.birthday.getFullYear();
    let mm = this.birthday.getMonth() + 1;
    let dd = this.birthday.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '.' + mm + '.' + yyyy;
  }

  getAge() {
    const today = new Date();
    let age = today.getFullYear() - this.birthday.getFullYear();
    let currMonth = today.getMonth() + 1;
    let m = currMonth - this.birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.birthday.getDate())) {
      age--;
    }
    return age;
  }
}