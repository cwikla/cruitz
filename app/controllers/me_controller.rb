class MeController < ApplicationController
  def index
    render json: current_user
  end

  def show
    render json: current_user
  end

  def password
    pwd = params.require(:user).require(:password)
    current_user.password = pwd
    if current_user.save
      bypass_sign_in(current_user)
    end

    render json: current_user
  end

  def update
    up = me_params
    up.delete :password # no doing here!

    if up[:logo] # should refactor this out
      upload = Upload.find(up[:logo])
      if upload.user_id == current_user.id  # make sure it's owned 
        puts "ME UPDATE"
        puts upload.inspect
        up[:logo] = upload
        puts up.inspect
      end
    end

    puts "PARMS"
    puts up.inspect

    @user = current_user

    if @user.update_without_password(up)
      puts "#{@user.inspect}"
      result = render json: @user
      puts result
      return result
    else
      puts @user.errors.inspect
      return render_create_error json: @user
    end
  end


  private

  def me_params
    params.require(:user).permit(:first_name, :last_name, :email, :logo)
  end

  


end
