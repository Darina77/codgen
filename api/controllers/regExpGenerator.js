class RegExpGenerator {
    constructor({
        //Однострочный коментарий
        oneLineComment,
        //Начало многострочного коментария
        manyLineCommentStart,
        //Конец многострочного коментария
        manyLineCommentEnd
    } = {}) {
        //Особенные символы которые используются в регулярных воражениях
        //Нужны чтобы в formCommentString методе отделить эти символы если они используются для коментирования
        this.specialChars = ['*', '+', '?', '^', '$'];
        this.oneLineComment = this.formCommentString(oneLineComment);
        this.manyLineCommentStart = this.formCommentString(manyLineCommentStart);
        this.manyLineCommentEnd = this.formCommentString(manyLineCommentEnd);
    }

    //Создает регулярное выражение которое ищет все вхождения value
    //value - указаное значение
    //value по умолчанию - ID
    //manyLineMode - указание на использование многострочного коментария в приоритете над однострочным
    getAllValueRegExp(value = "ID", manyLineMode = true) {
        return this.generateOne(new RegExp(`(${this.manyLineCommentStart}-+${value}-+${this.manyLineCommentEnd})`, 'g'),
            new RegExp(`(${this.oneLineComment}-+${value})`, 'g'),
            manyLineMode)
    }

    //Находит одно вхождение paramName
    //paramName - имя параметра
    //manyLineMode - указание на использование многострочного коментария в приоритете над однострочным
    getParamRegExp(paramName, manyLineMode = true) {
        return this.generateOne(new RegExp(`(${this.manyLineCommentStart}-+${paramName}-+${this.manyLineCommentEnd})`),
            new RegExp(`(${this.oneLineComment}-+${paramName})`),
            manyLineMode);
    }


    //Ищет текст в указанной секции
    //sectionName - название секции
    //manyLineMode - указание на использование многострочного коментария в приоритете над однострочным
    getSectionRexExp(sectionName, manyLineMode = false) {
        return this.generateOne(new RegExp(`(${this.manyLineCommentStart}-*${sectionName}-*${this.manyLineCommentEnd})([\\s\\S]*?)(${this.manyLineCommentStart}-*${sectionName} end-*${this.manyLineCommentEnd})`),
            new RegExp(`(${this.oneLineComment}-*${sectionName}-*\\s*)([\\S\\s]*?)(${this.oneLineComment}-*${sectionName} end-*)`),
            manyLineMode);
    }

    //Ищет секции
    findAllSections(sectionDef = "section", manyLineMode = false)
    {
        return this.generateOne(new RegExp(`(${this.manyLineCommentStart}-*([\\w\\s]+)${sectionDef}-*${this.manyLineCommentEnd})([\\s\\S]*?)(${this.manyLineCommentStart}-*([\\w\\s]+)${sectionDef} end-*${this.manyLineCommentEnd})`, 'g'),
            new RegExp(`(${this.oneLineComment}-*([\\w\\s]+)${sectionDef}-*\\s*)([\\S\\s]*?)(${this.oneLineComment}-*([\\w\\s]+)${sectionDef} end-*)`, 'g'),
            manyLineMode);
    }


    //Возращает текст без коментариев
    //lines - текст
    getLinesWithoutComment(lines) {
        var inRes = lines;
        if (lines) {
            inRes = inRes.replace(new RegExp(`${this.oneLineComment}`, 'g'), '');
            inRes = inRes.replace(new RegExp(`${this.manyLineCommentStart}`, 'g'), '');
            inRes = inRes.replace(new RegExp(`${this.manyLineCommentEnd}`, 'g'), '');
            return inRes.split('\n');
        } else return [];
    }

    //Очищает текст от пробельных символов
    //lines - текст
    clearLinesFromSpaces(lines) {
        var newLines = [];
        for (var oneNew of lines) {
            oneNew = oneNew.replace(/\s/g, '');
            if (oneNew.length > 0) {
                newLines.push(oneNew);
            }
        }
        return newLines;
    }


    //Делает проверку на то какое регулярное выражение выбрать
    //oneLineCommentExp - для однострочного комментария
    //manyLineCommentStart - для многострочного комментария
    //manyLineMode - указание на использование многострочного коментария в приоритете над однострочным
    generateOne(manyLinesCommentExp, oneLineCommentExp, manyLineMode) {
        var resEx;
        if (manyLineMode) {
            if (this.manyLineCommentStart && this.manyLineCommentEnd) {
                resEx = manyLinesCommentExp;
            } else if (this.oneLineComment) {
                resEx = oneLineCommentExp;
            } else {
                throw new Error("Comments type not defined")
            }

        } else {
            if (this.oneLineComment) {
                resEx = oneLineCommentExp;
            } else if (this.manyLineCommentStart && this.manyLineCommentEnd) {
                resEx = manyLinesCommentExp;
            } else {
                throw new Error("Comments type not defined")
            }

        }
        console.log("Genereted exp - " + resEx);
        return resEx;
    }

    //Проверяет символы которые устанавлюются для обозначения коментария в коде
    //Если символ относится к особенным (тем которые используются в регулярных выражениях)
    //То он отделяется \ чтобы в регулярном выржении символ воспринимался как текст
    //comment - обозначение коментария
    formCommentString(comment) {
        if (!comment) return;
        var newComment = "";
        for (var i = 0; i < comment.length; i++) {
            if (this.specialChars.includes(comment[i])) {
                newComment += '\\';
            }
            newComment += comment[i];
        }
        return String.raw `${newComment}`;
    }
}

module.exports = {
    RegExpGenerator
};