import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  User,
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  Palette,
  Save
} from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your school management system
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic configuration for your school management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">School Name</label>
                <Input defaultValue="Springfield Elementary School" />
                <p className="text-xs text-muted-foreground">
                  This will be displayed across the platform
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">School Address</label>
                <Input defaultValue="123 Education Street, Springfield, IL 62701" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input defaultValue="admin@springfield-school.edu" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Academic Year</label>
                <Input defaultValue="2023-2024" />
                <p className="text-xs text-muted-foreground">
                  Current academic year for the school
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                System Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Zone</label>
                  <Input defaultValue="America/Chicago" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Format</label>
                  <Input defaultValue="MM/DD/YYYY" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </div>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Attendance Alerts</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified about attendance issues
                    </div>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Grade Updates</div>
                    <div className="text-sm text-muted-foreground">
                      Notifications when grades are posted
                    </div>
                  </div>
                  <Badge variant="secondary">Disabled</Badge>
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">System Maintenance</div>
                    <div className="text-sm text-muted-foreground">
                      Updates about system maintenance
                    </div>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Session Timeout</div>
                    <div className="text-sm text-muted-foreground">
                      Auto-logout after 30 minutes of inactivity
                    </div>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Login Alerts</div>
                    <div className="text-sm text-muted-foreground">
                      Get notified of new login attempts
                    </div>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Password Policy</div>
                    <div className="text-sm text-muted-foreground">
                      Minimum 8 characters, must include numbers and symbols
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Integrations
              </CardTitle>
              <CardDescription>
                Connect with external services and platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-8 w-8 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <div className="font-medium">Email Service</div>
                      <div className="text-sm text-muted-foreground">
                        SMTP configuration for sending emails
                      </div>
                    </div>
                  </div>
                  <Badge variant="default">Connected</Badge>
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-8 w-8 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <div className="font-medium">Parent Portal API</div>
                      <div className="text-sm text-muted-foreground">
                        Integration with parent communication platform
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Database className="h-8 w-8 text-muted-foreground" />
                    <div className="space-y-0.5">
                      <div className="font-medium">Student Information System</div>
                      <div className="text-sm text-muted-foreground">
                        Sync with existing SIS database
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">Not Connected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance & Themes
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border rounded-lg p-3 text-center">
                      <div className="w-full h-20 bg-white border rounded mb-2"></div>
                      <div className="text-sm">Light</div>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <div className="w-full h-20 bg-gray-900 border rounded mb-2"></div>
                      <div className="text-sm">Dark</div>
                    </div>
                    <div className="border rounded-lg p-3 text-center border-primary">
                      <div className="w-full h-20 bg-gradient-to-br from-white to-gray-100 border rounded mb-2"></div>
                      <div className="text-sm font-medium">System</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Color</label>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-primary"></div>
                    <div className="w-8 h-8 rounded-full bg-green-600"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-600"></div>
                    <div className="w-8 h-8 rounded-full bg-orange-600"></div>
                    <div className="w-8 h-8 rounded-full bg-red-600"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 