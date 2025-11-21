import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FlaskConical, UserPlus, ArrowLeft, AlertCircle, Building2, FlaskRound, Sprout, BarChart3, CheckCircle2 } from 'lucide-react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface SignupProps {
  onBack: () => void;
}

export function Signup({ onBack }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('indoor-operator');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const signupSuccess = await signup(email, password, name, role);
    if (!signupSuccess) {
      setError('Email already exists. Please use a different email.');
    } else {
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onBack();
      }, 2000);
    }
  };

  const roleOptions = [
    {
      value: 'owner' as UserRole,
      label: 'Owner',
      description: 'Full access to all modules',
      icon: Building2,
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
      value: 'indoor-operator' as UserRole,
      label: 'Indoor Operator',
      description: 'Access to indoor modules only',
      icon: FlaskRound,
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      value: 'outdoor-operator' as UserRole,
      label: 'Outdoor Operator',
      description: 'Access to outdoor modules only',
      icon: Sprout,
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      value: 'sales-analyst' as UserRole,
      label: 'Sales & Report Analyser',
      description: 'Access to sales and reports modules',
      icon: BarChart3,
      color: 'bg-orange-50 border-orange-200 text-orange-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <FlaskConical className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seema Biotech</h1>
          <p className="text-gray-600">Create Your Account</p>
        </div>

        {/* Signup Card */}
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Choose your role and fill in your details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Created Successfully!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your account has been created. Redirecting to login page...
                </p>
              </div>
            ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Select Your Role</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roleOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <label
                          key={option.value}
                          className={`relative flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                            role === option.value
                              ? `${option.color} border-current`
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                          <div className="flex items-center space-x-3 flex-1">
                            <Icon className={`w-6 h-6 ${role === option.value ? 'text-current' : 'text-gray-400'}`} />
                            <div className="flex-1">
                              <div className={`font-semibold ${role === option.value ? 'text-current' : 'text-gray-900'}`}>
                                {option.label}
                              </div>
                              <div className={`text-xs mt-1 ${role === option.value ? 'text-current/80' : 'text-gray-500'}`}>
                                {option.description}
                              </div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11"
                  onClick={onBack}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 h-11">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </Button>
              </div>
            </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          © 2024 Seema Biotech. All rights reserved.
        </p>
      </div>
    </div>
  );
}

