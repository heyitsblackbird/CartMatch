import {readFileSync} from 'fs';

// Parse one csv line into raw string values
function parseLine(line: string): string[]{
    const values: string[] = [];
    let currentValue = "";
    let insideQuotes = false;

    for(let i=0; i<line.length; i++){
        const char = line[i];

        if (char === '"') {
            insideQuotes = !insideQuotes;
        } 
        else if(char === ',' && !insideQuotes) {
            values.push(currentValue.trim()); // Trim whitespace and push the current value
            currentValue = "";
        }
        else{
            currentValue += char;
        }
    }
    values.push(currentValue.trim()); // Push the last value

    return values;
}

function parseCsv(filePath: string): Record<string, string>[] {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '');

    const headers = parseLine(lines[0]);
    const data = lines.slice(1).map(line =>{
        const values = parseLine(line);
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
            row[header] = values[index] ?? "";
        });
        return row;
    });
    return data;
}

export default parseCsv;