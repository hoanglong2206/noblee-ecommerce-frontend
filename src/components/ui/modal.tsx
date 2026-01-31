"use client";

import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";

interface CustomModalProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
	size?: string;
}

export const CustomModal = ({
	open,
	onClose,
	children,
	size,
}: CustomModalProps) => {
	return (
		<Transition show={open} appear as={Fragment}>
			<Dialog as="div" className="relative z-999" onClose={onClose}>
				<div className="fixed inset-0 bg-black/10 bg-opacity-50" />

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<TransitionChild
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<DialogPanel
								className={`rounded-lg text-left align-middle ${size}`}
							>
								<div className="relative rounded-lg flex h-full w-full flex-col bg-background shadow-2xl">
									<div className="absolute right-4 top-4">
										<Button variant="ghost" onClick={onClose} size="icon">
											<X className="h-6 w-6" />
										</Button>
									</div>
									<div className="overflow-y-auto py-4 px-6">{children}</div>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};
