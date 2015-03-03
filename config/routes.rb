Rails.application.routes.draw do

  root 'home#index'

  namespace :api do
    resources :projects, only: :index do 
      member do
        get :cards
      end
      resources :iterations, only: [:create,:index, :show],shallow: true do
        member do
          get 'timelogs'
          get 'performance'
        end
      end
      resources :clients, only: [:create, :index, :update]
    end
    resources :timelogs, only: [:create,:index,:update]
  end
  
  namespace :api do
    post "/change_password/:reset_password_token", to: "change_password#change_password", as: 'change_password'    
  end
  devise_for :mongoid_users,controllers: {
    sessions: "sessions",
    passwords: "passwords"
  }


end
