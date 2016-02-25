ActiveAdmin.register Timelog do

  permit_params :fecha,:project_id,:project_name,:task_id,:task_name,:comment,:time,:user_id,:fecha,:trello,:iteration_id,:value_ajust,:due_date

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
