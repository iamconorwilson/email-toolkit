const command = (program) => {
    program
        .command('test')
        .description('Test command')
        .action(run);

}

const run = () => {
    //log current working directory
    console.log(process.cwd());
}

export default command;