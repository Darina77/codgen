class OneComponent {
    constructor({
        id,
        code,
        defaultResComponents
    } = {})
    {
       this.id = id,
       this.code = code,
       this.defaultResComponents = defaultResComponents,
       this.sections =
       {
        "include section": {},
        "define section": {},
        "global vars section": {},
        "funct section": {},
        "setup section": {},
        "loop section": {},
        "characteristics table section": {}
        };
    }

    putInSection(section, codeInOneSection, resFiles)
    {
        this.sections[section] = {codeInOneSection, resFiles}
    }

    getFromSection(section)
    {
        return this.sections[section];
    }
    
}

module.exports = { OneComponent };