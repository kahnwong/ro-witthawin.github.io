const fs = require("fs");
const Handlebars = require("handlebars");

const COURSES_COLUMNS = 3;

const PREPEND_SUMMARY_CATEGORIES = [
    "work",
    "volunteer",
    "awards",
    "publications",
    "projects"
];

const validateArray = (arr) => {
    return arr !== undefined && arr !== null && arr instanceof Array && arr.length > 0;
}

const dateSortValue = (date) => {
    if (!date) {
        return -Infinity;
    }

    if (date instanceof Date) {
        return date.getTime();
    }

    const value = String(date).trim();
    const parts = value.match(/^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);

    if (parts) {
        return Date.UTC(Number(parts[1]), Number(parts[2] || 1) - 1, Number(parts[3] || 1));
    }

    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? -Infinity : timestamp;
}

const render = (resume) => {
    // Split courses into 3 columns
    if (validateArray(resume.education)) {
        resume.education.forEach((block) => {
            if (validateArray(block.courses)) {
                const splitCourses = [];
                let columnIndex = 0;
                for (let i = 0; i < COURSES_COLUMNS; i++) {
                    splitCourses.push([]);
                }
                block.courses.forEach((course) => {
                    splitCourses[columnIndex].push(course);
                    columnIndex++;
                    if (columnIndex >= COURSES_COLUMNS) {
                        columnIndex = 0;
                    }
                });
                block.courses = splitCourses;
            }
        });
    }

    PREPEND_SUMMARY_CATEGORIES.forEach((category) => {
        if (resume[category] !== undefined) {
            resume[category].forEach((block) => {
                if (block.highlights === undefined) {
                    block.highlights = [];
                }
                block.highlights = block.highlights.map(hl => new Handlebars.SafeString(hl));
            });
        }
    });

    if (validateArray(resume.speaking)) {
        resume.speaking.sort((a, b) => dateSortValue(b.date) - dateSortValue(a.date));
    }

    const css = fs.readFileSync(`${__dirname  }/style.css`, "utf-8");
    const tpl = fs.readFileSync(`${__dirname  }/resume.hbs`, "utf-8");
    return Handlebars.compile(tpl)({
        css,
        resume
    });
}

const pdfRenderOptions = {
    mediaType: 'print'
};

module.exports = {
    pdfRenderOptions,
    render
};
