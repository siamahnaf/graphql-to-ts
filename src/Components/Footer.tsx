import Link from "next/link";

const Footer = () => {
    return (
        <div className="text-center mt-10">
            <p>Created By <Link href="https://siamahnaf.com" className="text-green-600 font-medium" target="_blank">Siam Ahnaf</Link></p>
        </div>
    );
};

export default Footer;