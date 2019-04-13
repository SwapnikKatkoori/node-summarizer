const Summarizer = require('./src/Summarizer').Summarizer;



const summarizer = new Summarizer("Detroit Pistons star forward Blake Griffin is still day-to-day heading into the postseason, coach Dwane Casey said Friday. Griffin, who has been dealing with a troublesome left knee, did not play in the regular-season finale Wednesday when Detroit wrapped up a playoff spot by winning at New York. With some of the best players in the league headed for free agency in July, the upcoming playoffs have an added layer of stress. The NBA playoffs start Saturday, but Detroit opens its series against the top-seeded Milwaukee Bucks on Sunday night. The extra rest was a bit of a break for the Pistons, who also get two days off before Games 2 and 3. Griffin played 75 games this season, his most since 2013-14, when he was with the LA Clippers. He averaged a career-high 24.5 points per game, along with 7.5 rebounds and 5.4 assists. He also made a career-high 189 3-pointers, shooting 36 percent from beyond the arc.", 4);
summarizer.summarize_by_rank()
