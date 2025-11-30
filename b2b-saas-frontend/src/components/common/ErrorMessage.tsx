interface ErrorMessageProps {
    message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
    return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>{message}</p>
        </div>
    );
};

export default ErrorMessage;
