import React from "react";

interface RankingMap {
	index: number;
}

function RankIcon({ index }: RankingMap) {
	switch (index) {
		case 0:
			return (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="3rem"
					height="3rem"
					viewBox="0 0 512 512"
				>
					<path
						fill="#b39802"
						d="M137.273 41c1.41 59.526 16.381 119.035 35.125 167.77c19.69 51.191 44.086 90.988 57.965 104.867l2.637 2.636V343h46v-26.727l2.637-2.636c13.879-13.88 38.275-53.676 57.965-104.867c18.744-48.735 33.715-108.244 35.125-167.77zm-50.605 68.295c-17.97 6.05-32.296 18.214-37.625 30.367c-3.015 6.875-3.48 13.44-.988 20.129c.285.766.62 1.54.996 2.318a119 119 0 0 1 8.504-4.812l6.277-3.215l4.621 5.326c5.137 5.92 9.61 12.37 13.422 19.125c2.573-3.06 5.207-7.864 7.05-14.037c4.491-15.034 4.322-36.95-2.257-55.201m338.664 0c-6.58 18.25-6.748 40.167-2.258 55.201c1.844 6.173 4.478 10.977 7.051 14.037c3.813-6.756 8.285-13.205 13.422-19.125l4.621-5.326l6.277 3.215a119 119 0 0 1 8.504 4.812c.375-.779.71-1.552.996-2.318c2.492-6.689 2.027-13.254-.988-20.129c-5.329-12.153-19.655-24.317-37.625-30.367m-365.975 67.74c-20.251 12.486-34.121 31.475-36.746 47.973c-1.447 9.1.09 17.224 5.323 24.545c1.66 2.324 3.743 4.594 6.304 6.76a116.6 116.6 0 0 1 11.44-14.977l4.72-5.24l6.217 3.33c7.91 4.236 15.262 9.424 21.94 15.252c.973-3.633 1.619-7.892 1.773-12.616c.636-19.438-6.762-45.536-20.97-65.027zm393.286 0c-14.21 19.49-21.607 45.59-20.971 65.027c.154 4.724.8 8.983 1.773 12.616c6.678-5.828 14.03-11.016 21.94-15.252l6.217-3.33l4.72 5.24a116.6 116.6 0 0 1 11.44 14.976c2.56-2.165 4.643-4.435 6.304-6.76c5.233-7.32 6.77-15.444 5.323-24.544c-2.625-16.498-16.495-35.487-36.746-47.973M54.4 259.133c-14.394 18.806-20.496 41.413-17.004 57.748c1.928 9.014 6.298 16.078 13.844 21.078c4.944 3.276 11.48 5.7 19.94 6.645a120.6 120.6 0 0 1 7.101-17.852l3.125-6.338l6.9 1.535c4.095.911 8.133 2.046 12.094 3.377c-.373-3.838-1.309-8.185-2.925-12.82c-6.416-18.396-22.749-40.184-43.075-53.373m403.2 0c-20.326 13.189-36.66 34.977-43.075 53.373c-1.616 4.635-2.552 8.982-2.925 12.82a119 119 0 0 1 12.093-3.377l6.9-1.535l3.126 6.338a120.6 120.6 0 0 1 7.101 17.852c8.46-.944 14.996-3.37 19.94-6.645c7.546-5 11.916-12.065 13.844-21.078c3.492-16.335-2.61-38.942-17.004-57.748M91.5 341.527c-9.285 23.14-9.027 47.85-.709 63.54c4.57 8.619 11.106 14.607 20.268 17.562c4.586 1.479 9.957 2.19 16.185 1.803c-2.135-11.155-2.771-22.97-1.756-34.938l.602-7.074l7.02-1.065a129 129 0 0 1 13.458-1.312c.554-.025 1.107-.04 1.66-.059c-12.419-15.776-33.883-31.43-56.728-38.457m329 0c-22.845 7.027-44.31 22.68-56.729 38.457c.554.019 1.107.034 1.66.059c4.5.206 8.995.637 13.46 1.312l7.02 1.065l.6 7.074c1.016 11.967.38 23.783-1.755 34.938c6.228.386 11.6-.324 16.185-1.803c9.162-2.955 15.699-8.943 20.268-17.563c8.318-15.69 8.576-40.4-.709-63.539M199.729 361c-1.943 7.383-6.045 14.043-11.366 19.363a47 47 0 0 1-3.484 3.125c14.804 3.295 28.659 8.692 40.404 15.46c2.384-5.36 5.376-10.345 9.408-14.534C239.96 378.942 247.51 375 256 375s16.041 3.942 21.309 9.414c4.032 4.19 7.024 9.175 9.408 14.533c11.815-6.808 25.766-12.23 40.67-15.52a48 48 0 0 1-3.739-3.413c-5.227-5.333-9.27-11.852-11.261-19.014zM256 393c-3.434 0-5.635 1.084-8.34 3.895s-5.395 7.52-7.527 13.298c-4.265 11.556-6.343 27-7.156 38.446c-1.07 15.043 3 33.368 12.285 40.06c4.733 3.412 16.743 3.412 21.476 0c9.285-6.692 13.355-25.017 12.285-40.06c-.813-11.446-2.891-26.89-7.156-38.446c-2.132-5.777-4.823-10.488-7.527-13.298c-2.705-2.81-4.906-3.895-8.34-3.895m-103.521 4.979q-2.572-.012-5.127.09c-1.405.055-2.77.281-4.164.39c-.418 27.817 9.816 53.543 24.994 66.644c8.264 7.134 17.586 10.772 28.35 10.157c5.908-.338 12.394-2.03 19.374-5.52c-1.27-7.665-1.377-15.42-.883-22.379c.632-8.89 1.852-19.962 4.479-30.877c-17.16-10.686-42.426-18.395-67.023-18.506zm207.042 0c-24.597.11-49.863 7.82-67.023 18.505c2.627 10.915 3.847 21.987 4.479 30.877c.494 6.958.387 14.714-.883 22.38c6.98 3.49 13.466 5.181 19.375 5.519c10.763.615 20.085-3.023 28.35-10.156c15.177-13.102 25.411-38.828 24.993-66.645c-1.393-.109-2.76-.335-4.164-.39a116 116 0 0 0-5.127-.09"
					></path>
				</svg>
			);
		case 1:
			return (
				<svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 64 64"><path fill="#1A2447" d="M44.656 26.519v-8.698c0-.364-.199-.67-.48-.86L54 2H35.164L32 6.746L28.836 2H10l9.822 14.96c-.281.19-.48.497-.48.861v8.698C14.861 30.187 12 35.758 12 42c0 11.045 8.955 20 20 20q1.023 0 2.018-.102C44.115 60.887 52 52.365 52 42c0-6.242-2.863-11.813-7.344-15.481M40.826 3h6.328l-8.826 13.239l-3.164-4.746zm.666 17.985l.973-1.458q.08.189.082.404v4.219a1 1 0 0 1-.297.7C39.25 23.052 35.752 22 32 22a19.87 19.87 0 0 0-10.252 2.851a1 1 0 0 1-.297-.701v-4.219c0-.143.031-.28.082-.404l.973 1.459zM16.846 3h6.328l11.324 16.985H28.17zM32 59c-9.389 0-17-7.611-17-17s7.611-17 17-17c9.387 0 17 7.612 17 17s-7.613 17-17 17"></path><path fill="#1A2447" d="M32.236 26.546c-8.666 0-15.691 7.036-15.691 15.718c0 2.59.637 5.025 1.744 7.178a17.4 17.4 0 0 1-.871-5.432c0-9.203 7.109-16.725 16.127-17.397a16 16 0 0 0-1.309-.067m6.297 28.593a17.7 17.7 0 0 1-4.988 2.316a15.9 15.9 0 0 0 6.918-2.578c7.203-4.842 9.158-14.5 4.367-21.576c-.244-.36-.508-.698-.777-1.031c4.427 7.736 2.117 17.736-5.52 22.869"></path><path fill="#1A2447" d="M38.448 49.207h-9.104v-2.275a3.036 3.036 0 0 1 3.034-3.035a6.067 6.067 0 0 0 6.069-6.068c0-2.957-1.5-6.828-6.827-6.828c-3.549 0-6.069 2.695-6.069 6.828h3.793c0-1.561 1.177-3.002 2.702-3.002c1.816 0 2.608 1.195 2.608 2.244a3.034 3.034 0 0 1-3.034 3.033a6.07 6.07 0 0 0-6.069 6.07V53h12.896z"></path></svg>
			);
		case 2:
			return (
				<svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 64 64"><path fill="#1A2447" d="M44.656 26.521v-8.697a1.04 1.04 0 0 0-.48-.861L54 2H35.164L32 6.747L28.836 2H10l9.822 14.961a1.04 1.04 0 0 0-.48.861v8.697C14.861 30.188 12 35.759 12 42.001C12 53.046 20.955 62 32 62q1.023 0 2.018-.102C44.115 60.888 52 52.366 52 42.001c0-6.242-2.863-11.813-7.344-15.48M40.826 3h6.328l-8.826 13.24l-3.164-4.746zm.666 17.987l.973-1.459q.08.188.082.404v4.219a.98.98 0 0 1-.297.699C39.25 23.053 35.752 22 32 22a19.86 19.86 0 0 0-10.252 2.852a1 1 0 0 1-.297-.701v-4.219c0-.145.031-.281.082-.404l.973 1.459zM16.846 3h6.328l11.324 16.987H28.17zM32 59.001c-9.389 0-17-7.611-17-17s7.611-17 17-17c9.387 0 17 7.611 17 17s-7.613 17-17 17"></path><path fill="#1A2447" d="M32.236 26.548c-8.666 0-15.691 7.037-15.691 15.717c0 2.59.637 5.025 1.744 7.18a17.5 17.5 0 0 1-.871-5.434c0-9.203 7.109-16.725 16.127-17.396a16 16 0 0 0-1.309-.067m6.297 28.592a17.6 17.6 0 0 1-4.988 2.316a15.86 15.86 0 0 0 6.918-2.578c7.203-4.842 9.158-14.5 4.369-21.576a17 17 0 0 0-.777-1.031c4.425 7.736 2.113 17.736-5.522 22.869"></path><path fill="#1A2447" d="M38.875 46.169q0-1.956-1.065-3.337q-1.066-1.382-2.845-1.778q2.978-1.69 2.979-4.526q0-1.998-1.454-3.585q-1.764-1.941-4.687-1.94q-1.708 0-3.084.669q-1.378.668-2.146 1.837q-.77 1.167-1.15 3.123l3.655.646q.156-1.41.876-2.146a2.34 2.34 0 0 1 1.736-.734q1.03 0 1.652.647q.621.645.621 1.733q0 1.28-.848 2.05q-.847.773-2.457.729l-.438 3.365q1.059-.309 1.822-.309q1.156 0 1.962.911q.806.91.806 2.468q0 1.648-.841 2.617t-2.068.97q-1.144-.001-1.948-.809c-.804-.808-.865-1.318-.988-2.338l-3.84.486q.297 2.717 2.146 4.401q1.85 1.682 4.659 1.683q2.963 0 4.955-1.999q1.99-1.998 1.99-4.834"></path></svg>
			);
		case 3:
			return (
				<svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24"><path fill="#B1CDFF" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m2 5a1 1 0 0 0-.993.883L13 8v3h-2V8l-.007-.117a1 1 0 0 0-1.986 0L9 8v3l.005.15a2 2 0 0 0 1.838 1.844L11 13h2v3l.007.117a1 1 0 0 0 1.986 0L15 16V8l-.007-.117A1 1 0 0 0 14 7"></path></svg>
			);
		case 4:
			return (
				<svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24"><path fill="#B1CDFF" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m2 5h-4a1 1 0 0 0-.993.883L9 8v4a1 1 0 0 0 .883.993L10 13h3v2h-2l-.007-.117A1 1 0 0 0 9 15a2 2 0 0 0 1.85 1.995L11 17h2a2 2 0 0 0 1.995-1.85L15 15v-2a2 2 0 0 0-1.85-1.995L13 11h-2V9h3a1 1 0 0 0 .993-.883L15 8a1 1 0 0 0-.883-.993z"></path></svg>
			);
		case 5:
			return (
				<svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24"><path fill="#B1CDFF" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m1 5h-2l-.15.005a2 2 0 0 0-1.844 1.838L9 9v6l.005.15a2 2 0 0 0 1.838 1.844L11 17h2l.15-.005a2 2 0 0 0 1.844-1.838L15 15v-2l-.005-.15a2 2 0 0 0-1.838-1.844L13 11h-2V9h2l.007.117A1 1 0 0 0 15 9a2 2 0 0 0-1.85-1.995zm0 6v2h-2v-2z"></path></svg>
			);
		case 6:
			return (
				<svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24"><path fill="#B1CDFF" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m2 5h-4l-.117.007a1 1 0 0 0-.876.876L9 8l.007.117a1 1 0 0 0 .876.876L10 9h2.718l-1.688 6.757l-.022.115a1 1 0 0 0 1.927.482l.035-.111l2-8l.021-.112a1 1 0 0 0-.878-1.125z"></path></svg>
			);
		case 7:
			return (
				<svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24"><path fill="#B1CDFF" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m1 5h-2l-.15.005a2 2 0 0 0-1.844 1.838L9 9v2l.005.15q.029.355.17.667l.075.152l.018.03l-.018.032c-.133.24-.218.509-.243.795L9 13v2l.005.15a2 2 0 0 0 1.838 1.844L11 17h2l.15-.005a2 2 0 0 0 1.844-1.838L15 15v-2l-.005-.15a2 2 0 0 0-.17-.667l-.075-.152l-.019-.032l.02-.03a2 2 0 0 0 .242-.795L15 11V9l-.005-.15a2 2 0 0 0-1.838-1.844zm0 6v2h-2v-2zm0-4v2h-2V9z"></path></svg>
			);
		case 8:
			return (
				<svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24"><path fill="#B1CDFF" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m1 5h-2l-.15.005a2 2 0 0 0-1.844 1.838L9 9v2l.005.15a2 2 0 0 0 1.838 1.844L11 13h2v2h-2l-.007-.117A1 1 0 0 0 9 15a2 2 0 0 0 1.85 1.995L11 17h2l.15-.005a2 2 0 0 0 1.844-1.838L15 15V9l-.005-.15a2 2 0 0 0-1.838-1.844zm0 2v2h-2V9z"></path></svg>
			);
		default:
			return null;
	}
}

export default RankIcon;