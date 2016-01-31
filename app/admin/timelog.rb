ActiveAdmin.register Timelog do
  filter :created_at
  filter :user

  index do
    column :fecha
    column :project_name
    column :task_name
    column :user do |t|
      User.find(t.user_id).email
    end

    column :time
    column :value_ajust

    actions
  end
end
