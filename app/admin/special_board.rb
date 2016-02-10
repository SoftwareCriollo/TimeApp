ActiveAdmin.register SpecialBoard do
  permit_params :trello_id, :name

  index do
    column :name
    column :trello_id
    actions
  end
end
