const Preprocesser = require('./src/Preprocesser').Preprocesser;

class Summarizer{
	constructor(){
		this.preprocesser = new Preprocesser("The Indiana Pacers and Indianapolis have agreed to a 25-year deal that commits roughly $800 million in public spending to keep the team in town.The Marion County Capital Improvement Board, which owns or manages the citys professional sports stadiums, voted unanimously in favor of the 157-page agreement at a Friday morning meeting. It will add amenities such as a big outdoor plaza, suite upgrades and an indoor fan deck and keep the Pacers in town through the 2043-44 NBA season, with options to extend it another three years. The terms include $295 million in public money announced at the meeting to upgrade Bankers Life Fieldhouse and roughly $362 million — described by the CIB later in the day as averaging $14.5 million a year over 25 years — to operate it over that time. The CIB would spend another $120 million on technology upgrades over 10 years, after which the board and the Pacers would renegotiate those terms to keep up with new tech. It also includes $17.6 million on maintenance and $4.6 million for the video and sound system that the CIB had previously agreed to pay.")
		console.log(this.preprocesser.process_string())
	}
}


const summarizer = new Summarizer()