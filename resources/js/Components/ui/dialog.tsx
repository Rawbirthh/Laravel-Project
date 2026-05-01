import * as React from "react";
import { X } from "lucide-react";
import { cn } from '@/lib/utils';

interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={() => onOpenChange?.(false)}
            />
            <div className="relative z-50 w-full max-w-lg bg-[#0f0f10] border border-slate-800 rounded-xl shadow-xl">
                {children}
            </div>
        </div>
    );
};

const DialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("p-6", className)}>{children}</div>
);

const DialogHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("flex flex-col space-y-1.5 mb-4", className)}>{children}</div>
);

const DialogTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <h2 className={cn("text-lg font-semibold text-white", className)}>{children}</h2>
);

const DialogDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <p className={cn("text-sm text-slate-400", className)}>{children}</p>
);

const DialogFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={cn("flex justify-end gap-3 mt-6", className)}>{children}</div>
);

const DialogClose: React.FC<{ onClose?: () => void; children: React.ReactNode }> = ({ onClose, children }) => (
    <div onClick={onClose}>{children}</div>
);

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose };