import { useState } from "react"
import { motion } from 'framer-motion';
import { Eye, EyeOff, Flame } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import imageTrainer from '@/assets/trainer.png'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
    dni: z.string().min(2, { message: "El dni debe tener al menos 7 caracteres" }),
    password: z.string()
})

export const Login = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dni: "",
            password: ""
        }
    })

    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)

    const handleLogin = (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }
    return (
        <div
            className="min-h-screen relative overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #FFE5D9 0%, #FFCAB0 50%, #FFB5A0 100%)",
            }}
        >
            <div className="absolute top-16 right-32 w-40 h-40 rounded-full bg-gradient-to-br from-orange-400 to-red-500 opacity-70"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-orange-600 opacity-60"></div>
            <div className="absolute top-1/3 left-1/3 w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 opacity-50"></div>

            <div className="flex min-h-screen">
                {/* Left side - Logo and welcome text */}
                <div className="flex-1 flex flex-col justify-center items-start pl-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <img
                                src="/logo.svg"
                                alt="App Logo"
                                loading="lazy"
                                className="h-15 w-15"
                            />
                            <h1 className="text-4xl font-bold text-orange-600">FitDesk</h1>
                        </div>

                        {/* Welcome text */}
                        <p className="text-gray-600 text-lg font-medium">¡Gracias Por Elegirnos!</p>
                    </motion.div>
                </div>

                <div className="flex-1 relative">
                    {/* Trainer image container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="relative w-full h-full flex items-center justify-center"
                    >
                        <div className="relative">
                            <img
                                src={imageTrainer}
                                alt="Fitness Trainer"
                                className="w-[600px] h-[700px] object-cover rounded-3xl"
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="absolute top-8 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm"
                            >
                                <div className="text-orange-400 font-bold">+ 1300</div>
                                <div className="text-xs">Positive Reviews</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.6 }}
                                className="absolute top-1/3 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm"
                            >
                                <div className="text-orange-400 font-bold">+ 80</div>
                                <div className="text-xs">Coaches</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9, duration: 0.6 }}
                                className="absolute bottom-32 left-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm"
                            >
                                <div className="text-orange-400 font-bold">+ 1000</div>
                                <div className="text-xs">Workout Videos</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1, duration: 0.6 }}
                                className="absolute bottom-16 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm"
                            >
                                <div className="text-orange-400 font-bold">+ 1500</div>
                                <div className="text-xs">Trainers</div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                bg-white/20 backdrop-blur-xs border border-white/30 shadow-2xl rounded-2xl p-8 w-80"                            >
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ingresa a FitDesk</h2>
                                    </div>
                                    <Form {...form} >
                                        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="dni"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="block text-sm font-medium text-gray-700 mb-2">DNI registrado</FormLabel>
                                                        <FormControl>
                                                            {/* <Input
                                                                type="text"
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                className="w-full bg-white border-gray-300"
                                                                required
                                                            /> */}
                                                            <Input
                                                                required
                                                                className="w-full bg-white border-gray-300"
                                                                placeholder="DNI"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="dni"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="block text-sm font-medium text-gray-700 mb-2">Contraseña</FormLabel>
                                                        <FormControl>
                                                            {/* <Input
                                                                type={showPassword ? "text" : "password"}
                                                                value={password}
                                                                onChange={(e) => setPassword(e.target.value)}
                                                                className="w-full bg-white border-gray-300 pr-10"
                                                                required
                                                            /> */}
                                                            <Input
                                                                type={showPassword ? "text" : "password"}
                                                                required
                                                                className="w-full bg-white border-gray-300"
                                                                placeholder="Contraseña"
                                                                {...field}
                                                            />
                                                            {/* <div className="relative">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                                >
                                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </button>
                                                            </div> */}
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />


                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={String(Math.random())}
                                                        checked={rememberMe}
                                                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                                    />
                                                    <label htmlFor="remember" className="text-sm text-gray-600">
                                                        Remember Me
                                                    </label>
                                                </div>
                                                <Link to="/auth/forgot-password" viewTransition className="text-sm text-orange-600 hover:text-orange-700">
                                                    Forgot Password?
                                                </Link>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
                                            >
                                                Login
                                            </Button>

                                            <div className="text-center">
                                                <span className="text-sm text-gray-600">Don't Have An Account? </span>
                                                <Link to="/auth/register" viewTransition className="text-sm text-orange-600 hover:text-orange-700 font-semibold">
                                                    Register
                                                </Link>
                                            </div>
                                        </form>
                                    </Form>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}