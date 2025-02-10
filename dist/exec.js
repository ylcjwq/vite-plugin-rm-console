import { exec } from 'node:child_process';
export function execCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
            if (stderr) {
                reject(new Error(stderr));
                return;
            }
            resolve(stdout.trim());
        });
    });
}
