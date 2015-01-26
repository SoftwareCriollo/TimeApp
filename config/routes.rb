Rails.application.routes.draw do

  root 'home#index'

  namespace :api do
    resources :projects, only: :index do 
      member do
        get :cards
      end
    end
    resources :iterations, only: [:create]
    resources :timelogs, only: [:create]
  end
  
#  namespace :api do
    devise_for :mongoid_users,controllers: {
      sessions: "sessions"
    }
    
 # end


end
