const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// GitHub info
const authorName = "Muhammad Aghnus Jamil";
const authorEmail = "42958036+Akhnus@users.noreply.github.com";  // CHANGE THIS

const startDateStr = "2018-01-01";
const endDateStr = "2024-12-31";
const maxCommitsPerDay = 4;
const skipChance = 0.25; // 25% chance to skip a day

const startDate = new Date(startDateStr);
const endDate = new Date(endDateStr);
const commitFile = path.resolve(__dirname, 'commit.txt');

// Create commit.txt if needed
if (!fs.existsSync(commitFile)) {
    fs.writeFileSync(commitFile, '');
    execSync(`git add ${commitFile}`);
    execSync(`GIT_AUTHOR_DATE="${startDateStr}T12:00:00" GIT_COMMITTER_DATE="${startDateStr}T12:00:00" GIT_AUTHOR_NAME="${authorName}" GIT_AUTHOR_EMAIL="${authorEmail}" GIT_COMMITTER_NAME="${authorName}" GIT_COMMITTER_EMAIL="${authorEmail}" git commit -m "Initial filler file"`);
    execSync('git push');
}

function isWeekend(date) {
    const d = date.getDay();
    return d === 0 || d === 6;
}

function addDays(date, days) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
}

function formatDate(date, hour) {
    return date.toISOString().split('T')[0] + ` ${hour}:00:00`;
}

let currentDate = startDate;

while (currentDate <= endDate) {
    if (!isWeekend(currentDate) && Math.random() > skipChance) {
        const commitsToday = Math.floor(Math.random() * maxCommitsPerDay) + 1;

        for (let i = 0; i < commitsToday; i++) {
            const hour = 10 + i;
            const commitDate = formatDate(currentDate, hour);

            const env = `GIT_AUTHOR_NAME="${authorName}" GIT_AUTHOR_EMAIL="${authorEmail}" GIT_COMMITTER_NAME="${authorName}" GIT_COMMITTER_EMAIL="${authorEmail}" GIT_AUTHOR_DATE="${commitDate}" GIT_COMMITTER_DATE="${commitDate}"`;

            fs.appendFileSync(commitFile, `${commitDate}\n`);
            execSync(`git add ${commitFile}`);
            execSync(`${env} git commit -m "Backdated commit for ${commitDate}"`);
            console.log(`✅ ${commitDate}`);
        }
    } else {
        console.log(`⏭️ Skipped ${currentDate.toISOString().split('T')[0]}`);
    }

    currentDate = addDays(currentDate, 1);
}

execSync('git push');
console.log("🚀 All commits pushed!");
