Rails.application.routes.draw do
  root 'home#index'

  get '/login' => 'users#login'
  get '/new_iteration' => 'users#new_iteration'

  
end
