import os

os.makedirs('pages/dashboard/patient', exist_ok=True)
os.makedirs('pages/dashboard/doctor', exist_ok=True)
os.makedirs('pages/dashboard/admin', exist_ok=True)

roles = ['patient', 'doctor', 'admin']

for role in roles:
    old_file = f'pages/dashboard/{role}.tsx'
    new_file = f'pages/dashboard/{role}/index.tsx'
    
    if os.path.exists(old_file):
        with open(old_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove the <Head> and <header> since layout handles it
        import re
        content = re.sub(r'<Head>.*?</Head>', '', content, flags=re.DOTALL)
        content = re.sub(r'<header.*?</header>', '', content, flags=re.DOTALL)
        content = re.sub(r'import Head from \'next/head\'\n?', '', content)
        
        # We need to wrap it with Layout
        content = content.replace('export default function', 'import DashboardLayout from \'../../../components/Layout/DashboardLayout\';\n\nexport default function')
        content = content.replace('<div className="min-h-screen bg-darkBG text-slate-200 font-sans selection:bg-primary-500 selection:text-white">', 
                                  f'<DashboardLayout role="{role}" title="Overview">')
        
        # fix closing tag </div> to </DashboardLayout> for the root
        last_div = content.rfind('</div>')
        if last_div != -1:
            content = content[:last_div] + '</DashboardLayout>' + content[last_div+6:]
            
        with open(new_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        os.remove(old_file)

# Write placeholder sub-pages
def write_placeholder(path, title, role):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(f'''import DashboardLayout from '../../../components/Layout/DashboardLayout';
export default function Page() {{
  return (
    <DashboardLayout role="{role}" title="{title}">
      <h1 className="text-3xl font-bold text-white mb-4">{title} - Coming Soon</h1>
      <div className="glass-card rounded-2xl p-12 text-center text-slate-400">
        This module is currently under active development.
      </div>
    </DashboardLayout>
  )
}}''')

write_placeholder('pages/dashboard/patient/appointments.tsx', 'Appointments', 'patient')
write_placeholder('pages/dashboard/patient/records.tsx', 'Records', 'patient')
write_placeholder('pages/dashboard/doctor/schedule.tsx', 'Schedule', 'doctor')
write_placeholder('pages/dashboard/doctor/patients.tsx', 'Patients', 'doctor')
write_placeholder('pages/dashboard/admin/staff.tsx', 'Staff Management', 'admin')
write_placeholder('pages/dashboard/admin/settings.tsx', 'Settings', 'admin')

print('Done migrating dashboard to multi-page portals!')
