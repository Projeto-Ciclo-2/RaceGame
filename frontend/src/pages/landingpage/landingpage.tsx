import React, { useState } from "react";
import "./landingpage.css";
import Car1 from "../../components/svg/car1";
import F1 from "../../components/svg/f1";
import { Login } from "../../components/other/login";

const LandingPage = () => {
	const [currentPage, setCurrentPage] = useState("welcome");

	const showWelcome = () => setCurrentPage("welcome");
	const showAboutUs = () => setCurrentPage("about");
	const showTeam = () => setCurrentPage("team");

	return (
		<div id="landing-page">
			<nav>
				<div id="nav-links">
					<div id="nav-logo">
						<h1 onClick={showWelcome}>Racing Game</h1>
					</div>
					<a onClick={showAboutUs}>About us</a>
					<a onClick={showTeam}>Our team</a>
				</div>
				<div id="sign-in">
				<Login/>
				</div>
				
			</nav>
			<div id="landing-content">
				{currentPage === "welcome" && (
					<div id="welcome">
						<div id="ldn-cnt-txt">
							<h1>Are you ready?</h1>
							<h2>
								Challenge your friends and be crowned the great
								champion!
							</h2>
						</div>
						<div id="ldn-cnt-svg">
							<Car1 />
						</div>
					</div>
				)}
				{currentPage === "about" && (
					<div id="about">
						<h1>About Us</h1>
						<p>
							Welcome to our website, where you will find an
							adrenaline-pumping multiplayer racing experience,
							where skill and speed define the champions! Our
							mission is to provide a fun, competitive and
							accessible game for all types of players, with a
							fluid and exciting dynamic. We developed this
							platform with the latest cutting-edge technologies,
							using React, WebSocket and the graphical power of
							Canvas to offer a vibrant and real-time visual
							experience.
						</p>
						<h2>How does it work?</h2>
						<p>In our game, you can:</p>
						<ul>
							<li>
								Create a custom race to challenge friends or
								other players around the world.
							</li>
							<li>
								Join an existing race and compete in real time
								with opponents of all levels.
							</li>
							<li>
								Climb the rankings with our global leaderboard,
								where each race counts points to show who the
								fastest and most skilled drivers are.
							</li>
						</ul>
						<p>
							<strong>
								Join now to experience this exciting race and
								find out who is the true champion of the tracks!
							</strong>
						</p>
						<F1 />
					</div>
				)}
				{currentPage === "team" && (
					<div id="team">
						<h1>Our Team</h1>
						<div id="cards">
							<div className="card">
								<div className="img" id="img1"></div>
								<span> Carlos Eduardo</span>
							</div>
							<div className="card">
								<div className="img" id="img2"></div>
								<span> Lígia Maria</span>
							</div>
							<div className="card">
								<div className="img" id="img3"></div>
								<span>Murilo Russo</span>
							</div>
							<div className="card">
								<div className="img" id="img4"></div>
								<span> Pedro Sávio</span>
							</div>
						</div>
						<div id="team-content">
							<h3>
								We are a team of aspiring web developers.
								Members of Class 5 of the Alpha EdTech program
							</h3>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
export default LandingPage;
