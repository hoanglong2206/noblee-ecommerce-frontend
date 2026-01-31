interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
	return (
		<main className="flex min-h-screen items-center justify-center bg-background">
			{children}
		</main>
	);
};

export default AuthLayout;
